import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Comments from '@/app/(protected)/_components/Conversation/Comments';
import type { AnswerComment } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor, within } from './render';

const sendCommentMock = vi.hoisted(() => vi.fn());
const deleteCommentMock = vi.hoisted(() => vi.fn());
const updateCommentMock = vi.hoisted(() => vi.fn());

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
