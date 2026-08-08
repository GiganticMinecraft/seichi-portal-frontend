'use client';

import { useEffect } from 'react';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type { GetAnswerStatusHistoryResponse } from '@/lib/api-types';

const EMPTY_STATUS_HISTORY_PAGE: GetAnswerStatusHistoryResponse = {
  items: [],
  next_cursor: null,
};

/**
 * 回答の対応状況変更履歴を全ページ取得する。enabled が false の間はリクエストしない
 * (履歴ダイアログを開くまで発火させないため)。
 */
export const useAnswerStatusHistory = (
  formId: string,
  answerId: string,
  enabled: boolean
) => {
  const { items, hasMore, isLoadingMore, loadMore } = useInfiniteApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/status/history',
    (cursor) => ({
      path: { form_id: formId, answer_id: answerId },
      query: cursor === undefined ? {} : { cursor },
    }),
    EMPTY_STATUS_HISTORY_PAGE,
    { enabled }
  );

  useEffect(() => {
    if (enabled && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [enabled, hasMore, isLoadingMore, loadMore]);

  return {
    entries: items,
    isLoading: enabled && (hasMore || isLoadingMore),
  };
};
