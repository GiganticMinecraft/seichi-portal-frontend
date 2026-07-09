import { describe, expect, it, vi } from 'vitest';

import ConversationSurface from '@/app/(protected)/_components/ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from '@/app/(protected)/_components/conversationTypes';

import { renderWithProviders, screen, waitFor } from './render';

const entries: ConversationEntryViewModel[] = [
  {
    id: 'entry-1',
    body: 'hello',
    authorName: 'Alice',
    authorRole: 'USER',
    timestamp: '2024-01-01T00:00:00Z',
    renderMode: 'plain',
    canDelete: false,
    canEdit: false,
  },
];

const capabilities: ConversationCapabilities = {
  canCompose: false,
  composeLabel: '',
  composeHelperText: '',
  emptyMessage: '投稿はまだありません',
  adminLabel: '運営',
  deepLinkQueryParam: 'commentId',
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
