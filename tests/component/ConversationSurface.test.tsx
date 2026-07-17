import { describe, expect, it, vi } from 'vitest';

import ConversationSurface from '@/app/(protected)/_components/Conversation/ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from '@/app/(protected)/_components/Conversation/conversationTypes';

import { fireEvent, renderWithProviders, screen, waitFor } from './render';

const entries: ConversationEntryViewModel[] = [
  {
    id: 'entry-1',
    body: 'hello',
    authorName: 'Alice',
    authorRole: 'USER',
    timestamp: '2024-01-01T00:00:00Z',
    surface: 'bubble',
    canDelete: false,
    canEdit: false,
  },
];

const capabilities: ConversationCapabilities = {
  canCompose: false,
  composeLabel: '',
  composeHelperText: '',
  emptyMessage: '投稿はまだありません',
  deepLinkQueryParam: 'commentId',
  entryNoun: 'コメント',
};

describe('ConversationSurface の直リンク自動オープン', () => {
  it('autoOpen が true の間、最初の1回だけ drawer を開く。ユーザーが閉じた後は再フェッチで渡ってくる autoOpen=true で再オープンしない', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onDrawerClose = vi.fn();

    const { rerender } = renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={entries}
        capabilities={capabilities}
        autoOpen
        onDrawerClose={onDrawerClose}
      />
    );

    // 自動的に開いている
    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();

    // ユーザーが閉じる
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onDrawerClose).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'コメント' })
      ).not.toBeInTheDocument();
    });

    // refreshInterval による再フェッチを模して、新しい entries 参照・同じ autoOpen=true で再描画する
    rerender(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={[...entries]}
        capabilities={capabilities}
        autoOpen
        onDrawerClose={onDrawerClose}
      />
    );

    // 勝手に開き直らない
    expect(
      screen.queryByRole('heading', { name: 'コメント' })
    ).not.toBeInTheDocument();
  });

  it('autoOpen が true→false→true(別 entry 向け)と変化した場合、2回目の true でも自動的に開く', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onDrawerClose = vi.fn();

    // 1. entry-1 への直リンクで自動的に開く
    const { rerender } = renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={entries}
        capabilities={capabilities}
        autoOpen
        highlightedEntryId="entry-1"
        onDrawerClose={onDrawerClose}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();

    // 2. ユーザーが閉じる(実際のページでは、これを契機に URL の
    //    entryId クエリが消え、やがて autoOpen が false になる)。
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'コメント' })
      ).not.toBeInTheDocument();
    });

    rerender(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={entries}
        capabilities={capabilities}
        autoOpen={false}
        onDrawerClose={onDrawerClose}
      />
    );

    // 3. 別の entry(entry-2)への直リンクにより autoOpen が再び true になった場合、
    //    ユーザーが閉じた直後の再フェッチとは異なり、今度は自動的に開き直るべき。
    rerender(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={entries}
        capabilities={capabilities}
        autoOpen
        highlightedEntryId="entry-2"
        onDrawerClose={onDrawerClose}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();
  });

  it('autoOpen が false の場合は自動的に開かない', () => {
    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={entries}
        capabilities={capabilities}
        autoOpen={false}
      />
    );

    expect(
      screen.queryByRole('heading', { name: 'コメント' })
    ).not.toBeInTheDocument();
  });
});

describe('ConversationSurface の Drawer 内で編集中に Esc キーを押したときの挙動 (#837)', () => {
  const editableEntries: ConversationEntryViewModel[] = [
    {
      id: 'entry-1',
      body: 'hello',
      authorName: 'Alice',
      authorRole: 'USER',
      timestamp: '2024-01-01T00:00:00Z',
      surface: 'bubble',
      canDelete: false,
      canEdit: true,
    },
  ];

  it('編集フォーム上で Esc を押すと、編集フォームだけが閉じて Drawer は開いたままになる', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onUpdate = vi.fn();

    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={editableEntries}
        capabilities={capabilities}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'コメントを開く' }));
    await screen.findByRole('heading', { name: 'コメント' });

    await user.click(screen.getByRole('button', { name: 'その他の操作' }));
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    const textbox = await screen.findByRole('textbox');
    expect(textbox).toBeVisible();

    // メニューを閉じた際のフォーカス復帰と競合しないよう、
    // 編集フォームへ明示的にフォーカスしてから Esc を押す(実際の利用者操作としても自然な導線)。
    await user.click(textbox);
    await user.keyboard('{Escape}');

    // 編集フォームは閉じて表示用の内容に戻る
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
    expect(screen.getByText('hello')).toBeVisible();
    // 編集は確定していない
    expect(onUpdate).not.toHaveBeenCalled();

    // Drawer 自体は開いたまま
    expect(screen.getByRole('heading', { name: 'コメント' })).toBeVisible();
  });

  it('編集メニュー選択直後、TextField を一切操作せず Esc を押しても、編集フォームだけが閉じて Drawer は開いたままになる(フォーカス競合の再現)', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onUpdate = vi.fn();

    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={editableEntries}
        capabilities={capabilities}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'コメントを開く' }));
    await screen.findByRole('heading', { name: 'コメント' });

    await user.click(screen.getByRole('button', { name: 'その他の操作' }));
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    expect(await screen.findByRole('textbox')).toBeVisible();

    // ここでは意図的に TextField をクリックしない。
    // Menu の Unstable_TrapFocus によるフォーカス復帰(元の IconButton へ戻す処理)が
    // TextField の autoFocus と競合し、実際の DOM フォーカスは IconButton に残ったまま
    // になり得る(#837)。この状態で Esc を押したときの挙動を検証する。
    await user.keyboard('{Escape}');

    // 編集フォームは閉じて表示用の内容に戻る
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
    expect(screen.getByText('hello')).toBeVisible();
    expect(onUpdate).not.toHaveBeenCalled();

    // Drawer 自体は開いたまま
    expect(screen.getByRole('heading', { name: 'コメント' })).toBeVisible();
  });

  it('編集フォームを開いていない状態で Esc を押すと、従来通り Drawer が閉じる', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onDrawerClose = vi.fn();

    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={editableEntries}
        capabilities={capabilities}
        onDrawerClose={onDrawerClose}
      />
    );

    await user.click(screen.getByRole('button', { name: 'コメントを開く' }));
    await screen.findByRole('heading', { name: 'コメント' });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'コメント' })
      ).not.toBeInTheDocument();
    });
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });

  it('編集中に「その他の操作」メニューを開いた状態で Esc を押すと、メニューだけが閉じて編集は維持される', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onUpdate = vi.fn();

    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={editableEntries}
        capabilities={capabilities}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'コメントを開く' }));
    await screen.findByRole('heading', { name: 'コメント' });

    await user.click(screen.getByRole('button', { name: 'その他の操作' }));
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));
    expect(await screen.findByRole('textbox')).toBeVisible();

    // 編集中にもう一度「その他の操作」を開く
    await user.click(screen.getByRole('button', { name: 'その他の操作' }));
    expect(
      await screen.findByRole('menuitem', { name: 'リンクをコピー' })
    ).toBeVisible();

    await user.keyboard('{Escape}');

    // メニューは閉じる
    await waitFor(() => {
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    });
    // 編集フォームは維持される(編集はキャンセルされない)
    expect(screen.getByRole('textbox')).toBeVisible();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('IME変換中の Esc(isComposing)では編集がキャンセルされない', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onUpdate = vi.fn();

    renderWithProviders(
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel="コメントを開く"
        entries={editableEntries}
        capabilities={capabilities}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'コメントを開く' }));
    await screen.findByRole('heading', { name: 'コメント' });

    await user.click(screen.getByRole('button', { name: 'その他の操作' }));
    await user.click(await screen.findByRole('menuitem', { name: '編集' }));

    const textbox = await screen.findByRole('textbox');
    await user.click(textbox);

    // IME変換候補をキャンセルするための Esc は isComposing: true で発生する。
    // user-event の {Escape} では isComposing を指定できないため fireEvent を使う。
    fireEvent.keyDown(textbox, { key: 'Escape', isComposing: true });

    // 編集はキャンセルされない
    expect(screen.getByRole('textbox')).toBeVisible();
    expect(onUpdate).not.toHaveBeenCalled();

    // Drawer も閉じない
    expect(screen.getByRole('heading', { name: 'コメント' })).toBeVisible();
  });
});
