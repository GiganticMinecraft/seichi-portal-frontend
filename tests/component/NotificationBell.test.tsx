import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NotificationBell from '@/app/_components/NotificationBell';
import type { NotificationResponse } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

type NotificationBellMocks = {
  markAsRead: ReturnType<
    typeof vi.fn<(id: string) => Promise<{ ok: boolean }>>
  >;
  markAllAsRead: ReturnType<typeof vi.fn<() => Promise<{ ok: boolean }>>>;
  push: ReturnType<typeof vi.fn>;
};

const mocks = vi.hoisted<NotificationBellMocks>(() => ({
  markAsRead: vi.fn<(id: string) => Promise<{ ok: boolean }>>(),
  markAllAsRead: vi.fn<() => Promise<{ ok: boolean }>>(),
  push: vi.fn(),
}));

const unreadNotification = {
  id: 'notification-1',
  notification_type: 'MESSAGE_RECEIVED',
  title: '回答『申請フォーム』に新しいメッセージが届きました。',
  body: '以下のリンクからメッセージを確認できます。',
  url: 'https://example.com/forms/form-1/answers/answer-1?messageId=message-1',
  created_at: '2026-08-23T00:00:00Z',
  read_at: null,
} satisfies NotificationResponse;

const readNotification = {
  ...unreadNotification,
  id: 'notification-2',
  title: '回答『問い合わせフォーム』に新しいメッセージが届きました。',
  url: 'https://example.com/forms/form-2/answers/answer-2?messageId=message-2',
  read_at: '2026-08-23T00:05:00Z',
} satisfies NotificationResponse;

let items: NotificationResponse[] = [];

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => ({
    items,
    unreadCount: items.filter((item) => !item.read_at).length,
    hasMore: false,
    isLoadingMore: false,
    sentinelRef: { current: null },
    loadMore: vi.fn(),
    markAsRead: mocks.markAsRead,
    markAllAsRead: mocks.markAllAsRead,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

describe('NotificationBell', () => {
  beforeEach(() => {
    items = [unreadNotification, readNotification];
    mocks.markAsRead.mockResolvedValue({ ok: true });
    mocks.markAllAsRead.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('未読件数をバッジに表示する', () => {
    renderWithProviders(<NotificationBell />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('未読通知をクリックすると既読化してリンク先の内部パスへ遷移する', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: '通知' }));
    await user.click(await screen.findByText(unreadNotification.title));

    await waitFor(() => {
      expect(mocks.markAsRead).toHaveBeenCalledWith(unreadNotification.id);
    });
    expect(mocks.push).toHaveBeenCalledWith(
      '/forms/form-1/answers/answer-1?messageId=message-1'
    );
  });

  it('既読済みの通知をクリックしても既読化を呼ばない', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: '通知' }));
    await user.click(await screen.findByText(readNotification.title));

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalled();
    });
    expect(mocks.markAsRead).not.toHaveBeenCalled();
  });

  it('未読が無いときは「すべて既読にする」を無効化する', async () => {
    items = [readNotification];
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: '通知' }));

    expect(
      await screen.findByRole('button', { name: 'すべて既読にする' })
    ).toBeDisabled();
  });

  it('「すべて既読にする」をクリックすると一括既読化する', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: '通知' }));
    await user.click(
      await screen.findByRole('button', { name: 'すべて既読にする' })
    );

    await waitFor(() => {
      expect(mocks.markAllAsRead).toHaveBeenCalled();
    });
  });
});
