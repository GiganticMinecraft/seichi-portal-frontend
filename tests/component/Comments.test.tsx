import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Comments from '@/app/(protected)/_components/Conversation/Comments';
import type { ConversationHistoryEntryViewModel } from '@/app/(protected)/_components/Conversation/conversationTypes';
import type { AnswerComment } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor, within } from './render';

const sendCommentMock = vi.hoisted(() => vi.fn());
const deleteCommentMock = vi.hoisted(() => vi.fn());
const updateCommentMock = vi.hoisted(() => vi.fn());

type CommentHistoryState = {
  historyByTargetId: Map<string, ConversationHistoryEntryViewModel[]>;
  isLoading: boolean;
};

const commentHistoryState = vi.hoisted<CommentHistoryState>(() => ({
  historyByTargetId: new Map(),
  isLoading: false,
}));

vi.mock(
  '@/app/(protected)/_components/Conversation/useConversationActions',
  () => ({
    useCommentConversationActions: () => ({
      send: sendCommentMock,
      update: updateCommentMock,
      deleteEntry: deleteCommentMock,
    }),
  })
);

vi.mock(
  '@/app/(protected)/_components/Conversation/useConversationHistory',
  () => ({
    useCommentHistory: () => commentHistoryState,
  })
);

beforeEach(() => {
  commentHistoryState.historyByTargetId = new Map();
  commentHistoryState.isLoading = false;
});

afterEach(() => {
  vi.clearAllMocks();
});

const comments: AnswerComment[] = [
  {
    id: 'comment-uuid-1',
    content: 'はじめまして',
    commented_by: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
    timestamp: '2024-01-01T00:00:00Z',
  },
  {
    id: 'comment-uuid-2',
    content: 'よろしくお願いします',
    commented_by: { name: 'Bob', role: 'STANDARD_USER', uuid: 'user-2' },
    timestamp: '2024-01-02T00:00:00Z',
  },
];

describe('Comments', () => {
  it('commentId 直リンクが comment.id と一致する場合に drawer を自動的に開く', async () => {
    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: 'comment-uuid-2', onClose: vi.fn() }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();
    expect(screen.getByText('よろしくお願いします')).toBeVisible();
  });

  it('commentId 直リンクが一致しない場合は、クラッシュせずエラー通知を表示する', async () => {
    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: 'no-such-comment', onClose: vi.fn() }}
      />
    );

    expect(
      await screen.findByText('指定されたコメントが見つかりませんでした。')
    ).toBeVisible();
    // drawer は自動的に開かない
    expect(
      screen.queryByRole('heading', { name: 'コメント' })
    ).not.toBeInTheDocument();
  });

  it('「その他の操作」メニューの「リンクをコピー」から、origin + パス + commentId 形式の絶対 URL をコピーでき、コピー後にフィードバックが表示される', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    expect(menuTriggers).toHaveLength(comments.length);

    const secondCommentMenuTrigger = menuTriggers[1];
    if (secondCommentMenuTrigger === undefined) {
      throw new Error('2 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(secondCommentMenuTrigger);

    await user.click(
      await screen.findByRole('menuitem', { name: 'リンクをコピー' })
    );

    expect(writeTextSpy).toHaveBeenCalledWith(
      `${window.location.origin}/?commentId=comment-uuid-2`
    );
    expect(await screen.findByText('リンクをコピーしました')).toBeVisible();
  });

  it('コメント本文は Markdown として解釈され、強調記法が実際の要素として描画される(#833)', async () => {
    const user = userEvent.setup();
    const markdownComments: AnswerComment[] = [
      {
        id: 'comment-uuid-markdown',
        content: '**重要**な連絡です',
        commented_by: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
        timestamp: '2024-01-01T00:00:00Z',
      },
    ];

    renderWithProviders(
      <Comments
        comments={markdownComments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${markdownComments.length}\\)`),
      })
    );

    const strong = await screen.findByText('重要');
    expect(strong.tagName).toBe('STRONG');
  });

  it('独立したコピーアイコンは表示されない(誤操作防止のため三点リーダーメニュー経由のみ)', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    await screen.findAllByRole('button', { name: 'その他の操作' });
    expect(
      screen.queryByRole('button', { name: 'リンクをコピー' })
    ).not.toBeInTheDocument();
  });
});

/**
 * canEdit は「投稿者本人かどうか」だけで決まり、showDeleteButton (管理者向けの
 * 一律削除許可) には連動しない設計(#838)。この非対称性を、一般ユーザー画面・
 * 管理者画面の両方に相当する props の組み合わせで確認する。
 */
describe('Comments のコメント編集メニュー表示条件 (canEdit)', () => {
  const openMenuFor = async (
    user: ReturnType<typeof userEvent.setup>,
    index: number
  ) => {
    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );
    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    const trigger = menuTriggers[index];
    if (trigger === undefined) {
      throw new Error(
        `${index} 件目のコメントの操作メニュー button が見つかりません`
      );
    }
    await user.click(trigger);
  };

  it('一般ユーザー画面相当: 自分が投稿したコメントには編集メニューが表示される', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="user-1"
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await openMenuFor(user, 0);
    expect(await screen.findByRole('menuitem', { name: '編集' })).toBeVisible();
  });

  it('一般ユーザー画面相当: 他人が投稿したコメントには編集メニューが表示されない', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="user-1"
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await openMenuFor(user, 1);
    await screen.findByRole('menuitem', { name: 'リンクをコピー' });
    expect(
      screen.queryByRole('menuitem', { name: '編集' })
    ).not.toBeInTheDocument();
  });

  it('管理者画面相当: 管理者自身が投稿したコメントには編集メニューが表示される', async () => {
    const user = userEvent.setup();
    const adminComments: AnswerComment[] = [
      {
        id: 'comment-uuid-admin',
        content: '対応します',
        commented_by: {
          name: 'Admin',
          role: 'ADMINISTRATOR',
          uuid: 'admin-1',
        },
        timestamp: '2024-01-03T00:00:00Z',
      },
    ];

    renderWithProviders(
      <Comments
        comments={adminComments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="admin-1"
        showDeleteButton
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(screen.getByRole('button', { name: /コメント \(1\)/ }));
    await user.click(
      await screen.findByRole('button', { name: 'その他の操作' })
    );
    expect(await screen.findByRole('menuitem', { name: '編集' })).toBeVisible();
  });

  it('管理者画面相当: showDeleteButton により削除メニューは表示されるが、自分以外が投稿したコメントには編集メニューは表示されない(削除許可と編集許可は連動しない)', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="admin-1"
        showDeleteButton
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await openMenuFor(user, 0);
    expect(await screen.findByRole('menuitem', { name: '削除' })).toBeVisible();
    expect(
      screen.queryByRole('menuitem', { name: '編集' })
    ).not.toBeInTheDocument();
  });
});

/**
 * ConversationComposer の autoFocus / 送信後フォーカス復元は Comments・Messages で
 * 共有される挙動だが、Drawer の開閉タイミングや Escape キーとの競合(#837)は
 * 実際に Drawer・ConversationSurface・ConversationEntry を組んだ状態でしか
 * 再現できないため、Comments を経由して統合的に確認する(Messages 側は同じ
 * ConversationComposer を同じ配線で使うだけなので、ここでの確認を重複させない)。
 */
describe('Comments の投稿欄オートフォーカス・フォーカス復元', () => {
  const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((res) => {
      resolve = res;
    });
    return { promise, resolve };
  };

  it('トリガーボタンのクリックで Drawer を開いたとき、コメント入力欄に自動でフォーカスが当たる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const composerInput =
      await screen.findByPlaceholderText('コメントを入力...');
    await waitFor(() => {
      expect(composerInput).toHaveFocus();
    });
  });

  it('直リンク経由で Drawer が自動的に開いたときも、コメント入力欄に自動でフォーカスが当たる', async () => {
    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: 'comment-uuid-2', onClose: vi.fn() }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();

    const composerInput =
      await screen.findByPlaceholderText('コメントを入力...');
    await waitFor(() => {
      expect(composerInput).toHaveFocus();
    });
  });

  it('コメント送信が成功した直後、入力欄にフォーカスが戻る(送信中は disabled のため解除を待ってから確認する)', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<{ success: boolean }>();
    sendCommentMock.mockReturnValue(promise);

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const composerInput =
      await screen.findByPlaceholderText('コメントを入力...');
    await user.type(composerInput, '新しいコメント');
    await user.click(screen.getByRole('button', { name: '送信' }));

    // 送信中は disabled になり、フォーカスを当てても効かない制約がある。
    await waitFor(() => {
      expect(composerInput).toBeDisabled();
    });

    resolve({ success: true });

    // disabled が解除されるまで待ってからフォーカスの復元を確認する。
    await waitFor(() => {
      expect(composerInput).not.toBeDisabled();
    });
    await waitFor(() => {
      expect(composerInput).toHaveFocus();
    });
  });
});

/**
 * #837: 編集フォームの autoFocus と MUI Menu の Unstable_TrapFocus によるフォーカス
 * 復帰が競合し、Esc キーの挙動が壊れたバグの回帰テスト(tests/component/ConversationSurface.test.tsx)
 * は、composer(投稿用入力欄)を持たない ConversationSurface 単体を対象にしている。
 * しかし実際の画面では、Drawer 内に「投稿用入力欄(今回 autoFocus を追加)」と
 * 「編集用入力欄(既存の autoFocus)」が同時に存在し得る(コメント編集中も Drawer 下部の
 * 投稿欄は表示されたまま)。autoFocus を持つ要素が Drawer 内に増えたことで、この
 * フォーカスの奪い合いが #837 と同種の Esc 誤動作を新たに引き起こさないことを、
 * 投稿欄を実際に持つ Comments を経由して確認する。
 */
describe('Comments: 投稿欄(autoFocus)と編集欄(autoFocus)が同時に存在する場合の Esc キー挙動', () => {
  it('編集メニュー選択直後、編集欄を一切操作せず Esc を押しても、編集フォームだけが閉じて Drawer(と投稿欄)は維持される', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="user-1"
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );
    // 投稿欄が Drawer 内に存在している(autoFocus を持つ要素が既に1つ増えている状態)
    await screen.findByPlaceholderText('コメントを入力...');

    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    const firstTrigger = menuTriggers[0];
    if (firstTrigger === undefined) {
      throw new Error('1 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(firstTrigger);
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    // 編集用 TextField と投稿用 TextField の 2 つが同時に存在する
    const editTextbox = await screen.findByDisplayValue('はじめまして');
    expect(editTextbox).toBeVisible();

    // 意図的に編集欄をクリックせず Esc を押す(#837 が再現していた最悪ケース)
    await user.keyboard('{Escape}');

    // 編集フォームは閉じて表示用の内容に戻る
    await waitFor(() => {
      expect(
        screen.queryByDisplayValue('はじめまして')
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('はじめまして')).toBeVisible();
    expect(updateCommentMock).not.toHaveBeenCalled();

    // Drawer 自体・投稿欄は維持される
    expect(screen.getByRole('heading', { name: 'コメント' })).toBeVisible();
    expect(
      screen.getByPlaceholderText('コメントを入力...')
    ).toBeInTheDocument();
  });
});

describe('Comments のコメント編集・削除の結果表示', () => {
  it('自分のコメントを編集して保存すると、update が (commentId, 新しい内容) で呼ばれ、編集フォームが閉じる', async () => {
    const user = userEvent.setup();
    updateCommentMock.mockResolvedValue({ success: true });

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="user-1"
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );
    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    const firstTrigger = menuTriggers[0];
    if (firstTrigger === undefined) {
      throw new Error('1 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(firstTrigger);
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    // 編集用 TextField と drawer 下部の投稿用 TextField の 2 つが同時に
    // role="textbox" として存在するため、編集対象の初期値で絞り込む。
    const textbox = await screen.findByDisplayValue('はじめまして');
    await user.clear(textbox);
    await user.type(textbox, '内容を更新しました{Enter}');

    expect(updateCommentMock).toHaveBeenCalledWith(
      'comment-uuid-1',
      '内容を更新しました'
    );

    // 保存成功時は編集フォームを閉じる(この component は再取得データを
    // props で受け取る側であり、表示内容自体の反映は SWR の再検証に委ねる)。
    const entryContainer = document.getElementById(
      'conversation-entry-comment-uuid-1'
    );
    if (entryContainer === null) {
      throw new Error('編集対象コメントの container が見つかりません');
    }
    await waitFor(() => {
      expect(
        within(entryContainer).queryByRole('textbox')
      ).not.toBeInTheDocument();
    });
  });

  it('編集が forbidden で拒否された場合、"コメント" という語で権限エラーを表示する(メッセージ側の固定文言バグの再発防止)', async () => {
    const user = userEvent.setup();
    updateCommentMock.mockResolvedValue({ success: false, forbidden: true });

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId="user-1"
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );
    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    const firstTrigger = menuTriggers[0];
    if (firstTrigger === undefined) {
      throw new Error('1 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(firstTrigger);
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    const textbox = await screen.findByDisplayValue('はじめまして');
    await user.type(textbox, '更新{Enter}');

    expect(
      await screen.findByText('このコメントを編集する権限がありません。')
    ).toBeVisible();
  });

  it('削除が forbidden で拒否された場合、"コメント" という語で権限エラーを表示する(既存の固定文言バグの再発防止)', async () => {
    const user = userEvent.setup();
    deleteCommentMock.mockResolvedValue({ success: false, forbidden: true });

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );
    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    const firstTrigger = menuTriggers[0];
    if (firstTrigger === undefined) {
      throw new Error('1 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(firstTrigger);
    await user.click(await screen.findByRole('menuitem', { name: '削除' }));

    expect(
      await screen.findByText('このコメントを削除する権限がありません。')
    ).toBeVisible();
  });
});

describe('Comments の編集履歴 (GitHub 風の「編集済み」表示)', () => {
  it('CREATE 履歴しかないコメントには「編集済み」表示が出ない', async () => {
    const user = userEvent.setup();
    commentHistoryState.historyByTargetId = new Map([
      [
        'comment-uuid-1',
        [
          {
            id: 'history-1',
            targetId: 'comment-uuid-1',
            action: 'CREATE',
            body: 'はじめまして',
            operatedByName: 'Alice',
            operatedByRole: 'STANDARD_USER',
            operatedAt: '2024-01-01T00:00:00Z',
            originalAuthorName: 'Alice',
            originalAuthorRole: 'STANDARD_USER',
            originalTimestamp: '2024-01-01T00:00:00Z',
          },
        ],
      ],
    ]);

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    expect(
      screen.queryByRole('button', { name: '(編集済み)' })
    ).not.toBeInTheDocument();
  });

  it('UPDATE 履歴があるコメントには「編集済み」表示が出て、クリックするとそのコメントだけの履歴が開く', async () => {
    const user = userEvent.setup();
    commentHistoryState.historyByTargetId = new Map([
      [
        'comment-uuid-1',
        [
          {
            id: 'history-1',
            targetId: 'comment-uuid-1',
            action: 'CREATE',
            body: '元の内容',
            operatedByName: 'Alice',
            operatedByRole: 'STANDARD_USER',
            operatedAt: '2024-01-01T00:00:00Z',
            originalAuthorName: 'Alice',
            originalAuthorRole: 'STANDARD_USER',
            originalTimestamp: '2024-01-01T00:00:00Z',
          },
          {
            id: 'history-2',
            targetId: 'comment-uuid-1',
            action: 'UPDATE',
            body: 'はじめまして',
            operatedByName: 'Alice',
            operatedByRole: 'STANDARD_USER',
            operatedAt: '2024-01-01T01:00:00Z',
            originalAuthorName: 'Alice',
            originalAuthorRole: 'STANDARD_USER',
            originalTimestamp: '2024-01-01T00:00:00Z',
          },
        ],
      ],
    ]);

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const editedLabel = await screen.findByRole('button', {
      name: '(編集済み)',
    });
    await user.click(editedLabel);

    expect(
      await screen.findByRole('heading', { name: 'コメントの編集履歴' })
    ).toBeVisible();
    expect(screen.getByText('元の内容')).toBeVisible();
    // 2件目のコメント本文と同じ文言が history にも出るため、Dialog 内に
    // 絞って確認する。
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('投稿')).toBeVisible();
    expect(within(dialog).getByText('更新')).toBeVisible();
  });
});

describe('Comments の削除済みコメント表示(管理者のみ)', () => {
  const deletedHistory: Map<string, ConversationHistoryEntryViewModel[]> =
    new Map([
      [
        'comment-uuid-deleted',
        [
          {
            id: 'history-1',
            targetId: 'comment-uuid-deleted',
            action: 'CREATE',
            body: '削除される予定のコメント',
            operatedByName: 'Carol',
            operatedByRole: 'STANDARD_USER',
            operatedAt: '2024-01-03T00:00:00Z',
            originalAuthorName: 'Carol',
            originalAuthorRole: 'STANDARD_USER',
            originalTimestamp: '2024-01-03T00:00:00Z',
          },
          {
            id: 'history-2',
            targetId: 'comment-uuid-deleted',
            action: 'DELETE',
            body: '削除される予定のコメント',
            operatedByName: 'Admin',
            operatedByRole: 'ADMINISTRATOR',
            operatedAt: '2024-01-03T01:00:00Z',
            originalAuthorName: 'Carol',
            originalAuthorRole: 'STANDARD_USER',
            originalTimestamp: '2024-01-03T00:00:00Z',
          },
        ],
      ],
    ]);

  it('isAdmin=false の場合、削除済みコメントは表示されない', async () => {
    const user = userEvent.setup();
    commentHistoryState.historyByTargetId = deletedHistory;

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin={false}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    expect(screen.queryByText(/削除されたコメント/)).not.toBeInTheDocument();
  });

  it('isAdmin=true の場合、削除済みコメントは折りたたみ表示され、クリックで内容が展開される', async () => {
    const user = userEvent.setup();
    commentHistoryState.historyByTargetId = deletedHistory;

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        isAdmin
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const deletedRow = await screen.findByText(/削除されたコメント\(Carol\)/);
    expect(deletedRow).toBeVisible();
    // Collapse は内容を DOM に残したまま高さで折りたたむため、存在ではなく
    // 可視性で「まだ展開していない」ことを確認する。
    expect(screen.getByText('削除される予定のコメント')).not.toBeVisible();

    await user.click(deletedRow);

    expect(await screen.findByText('削除される予定のコメント')).toBeVisible();
    expect(screen.getByText(/削除: Admin/)).toBeVisible();
  });
});
