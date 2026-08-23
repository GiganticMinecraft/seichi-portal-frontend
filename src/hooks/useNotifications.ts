'use client';

import { useSWRConfig } from 'swr';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import type { GetNotificationsPageResponse } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

const EMPTY_NOTIFICATIONS_PAGE: GetNotificationsPageResponse = {
  items: [],
  next_cursor: null,
};

const NOTIFICATIONS_REFRESH_INTERVAL_MS = 15000;

const isNotificationsKey = (key: unknown): boolean =>
  Array.isArray(key) && key[0] === '/api/v1/notifications';

export const useNotifications = () => {
  const { mutate } = useSWRConfig();
  const { items, hasMore, isLoadingMore, sentinelRef, loadMore } =
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
    const { response } = await proxyClient.PATCH(
      '/api/v1/notifications/{notification_id}/read',
      { params: { path: { notification_id: notificationId } } }
    );
    if (response.ok) {
      void mutate(isNotificationsKey).catch(() => {});
    }
    return { ok: response.ok };
  };

  const markAllAsRead = async (): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH(
      '/api/v1/notifications/read-all',
      {}
    );
    if (response.ok) {
      void mutate(isNotificationsKey).catch(() => {});
    }
    return { ok: response.ok };
  };

  return {
    items,
    unreadCount,
    hasMore,
    isLoadingMore,
    sentinelRef,
    loadMore,
    markAsRead: useSingleFlightAction(markAsRead),
    markAllAsRead: useSingleFlightAction(markAllAsRead),
  };
};
