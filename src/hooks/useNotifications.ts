'use client';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import type { GetNotificationsPageResponse } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

const EMPTY_NOTIFICATIONS_PAGE: GetNotificationsPageResponse = {
  items: [],
  next_cursor: null,
};

const NOTIFICATIONS_REFRESH_INTERVAL_MS = 15000;

const markItemsAsReadLocally = (
  pages: GetNotificationsPageResponse[] | undefined,
  ids: Set<string>,
  readAt: string
): GetNotificationsPageResponse[] | undefined =>
  pages?.map((page) => ({
    ...page,
    items: page.items.map((item) =>
      ids.has(item.id) && !item.read_at ? { ...item, read_at: readAt } : item
    ),
  }));

export const useNotifications = () => {
  const { items, hasMore, isLoadingMore, sentinelRef, mutatePages } =
    useInfiniteApiQuery(
      '/api/v1/notifications',
      (cursor) => ({
        query: cursor === undefined ? {} : { cursor },
      }),
      EMPTY_NOTIFICATIONS_PAGE,
      { refreshInterval: NOTIFICATIONS_REFRESH_INTERVAL_MS }
    );

  const unreadCount = items.filter((item) => !item.read_at).length;

  const markAsRead = async (
    notificationId: string
  ): Promise<{ ok: boolean }> => {
    const readAt = new Date().toISOString();
    // 既読 API はレスポンスに時間がかかることがあるため、ベルの未読表示は
    // 先に楽観的に書き換え、失敗時のみサーバーの状態へ巻き戻す。
    await mutatePages(
      (pages) =>
        markItemsAsReadLocally(pages, new Set([notificationId]), readAt),
      { revalidate: false }
    );

    const { response } = await proxyClient.PATCH(
      '/api/v1/notifications/{notification_id}/read',
      { params: { path: { notification_id: notificationId } } }
    );

    if (!response.ok) {
      void mutatePages().catch(() => {});
      return { ok: false };
    }
    return { ok: true };
  };

  const markAllAsRead = async (): Promise<{ ok: boolean }> => {
    const readAt = new Date().toISOString();
    const unreadIds = new Set(
      items.filter((item) => !item.read_at).map((item) => item.id)
    );
    await mutatePages(
      (pages) => markItemsAsReadLocally(pages, unreadIds, readAt),
      { revalidate: false }
    );

    const { response } = await proxyClient.PATCH(
      '/api/v1/notifications/read-all',
      {}
    );

    if (!response.ok) {
      void mutatePages().catch(() => {});
      return { ok: false };
    }
    return { ok: true };
  };

  return {
    items,
    unreadCount,
    hasMore,
    isLoadingMore,
    sentinelRef,
    markAsRead: useSingleFlightAction(markAsRead),
    markAllAsRead: useSingleFlightAction(markAllAsRead),
  };
};
