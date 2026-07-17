'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type {
  CommentHistoryResponseEntry,
  GetCommentHistoryResponse,
  GetMessageHistoryResponse,
  MessageHistoryResponseEntry,
} from '@/lib/api-types';

import type { ConversationHistoryEntryViewModel } from './conversationTypes';

const EMPTY_COMMENT_HISTORY_PAGE: GetCommentHistoryResponse = {
  items: [],
  next_cursor: null,
};
const EMPTY_MESSAGE_HISTORY_PAGE: GetMessageHistoryResponse = {
  items: [],
  next_cursor: null,
};

/** hasMore の間、ユーザー操作を待たずに次ページを取得し続ける。履歴 API は
 * コメント/メッセージ単位のフィルタを持たないため、編集済みバッジや削除済み
 * 表示の判定には全履歴が必要になる。 */
const useAutoLoadAll = (
  hasMore: boolean,
  isLoadingMore: boolean,
  loadMore: () => void
) => {
  useEffect(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);
};

/**
 * 初回の全ページ読み込みが完了したかどうかだけを返す。ポーリングによる
 * バックグラウンドの再取得(isLoadingMore が一時的に true になる)では
 * false に戻さない。編集済みバッジ等が定期ポーリングのたびに点滅しないため、
 * 一度 true になったら二度と setState しないよう ref でガードする
 * (ConversationSurface の hasAutoOpenedRef と同じ「一度きりのラッチ」パターン)。
 */
const useHasCompletedInitialLoad = (
  hasMore: boolean,
  isLoadingMore: boolean
) => {
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
  const hasCompletedOnceRef = useRef(false);

  useEffect(() => {
    if (!hasMore && !isLoadingMore && !hasCompletedOnceRef.current) {
      hasCompletedOnceRef.current = true;
      setHasCompletedOnce(true);
    }
  }, [hasMore, isLoadingMore]);

  return hasCompletedOnce;
};

const groupByTargetId = (
  items: ConversationHistoryEntryViewModel[]
): Map<string, ConversationHistoryEntryViewModel[]> => {
  const map = new Map<string, ConversationHistoryEntryViewModel[]>();
  items.forEach((item) => {
    const list = map.get(item.targetId);
    if (list) {
      list.push(item);
    } else {
      map.set(item.targetId, [item]);
    }
  });
  map.forEach((list) => {
    list.sort((a, b) => a.operatedAt.localeCompare(b.operatedAt));
  });
  return map;
};

const toCommentHistoryViewModel = (
  item: CommentHistoryResponseEntry
): ConversationHistoryEntryViewModel => ({
  id: item.id,
  targetId: item.comment_id,
  action: item.action,
  body: item.content,
  operatedByName: item.operated_by.name,
  operatedByRole: item.operated_by.role,
  operatedAt: item.operated_at,
  originalAuthorName: item.original_author.name,
  originalAuthorRole: item.original_author.role,
  originalTimestamp: item.original_timestamp,
});

const toMessageHistoryViewModel = (
  item: MessageHistoryResponseEntry
): ConversationHistoryEntryViewModel => ({
  id: item.id,
  targetId: item.message_id,
  action: item.action,
  body: item.body,
  operatedByName: item.operated_by.name,
  operatedByRole: item.operated_by.role,
  operatedAt: item.operated_at,
  originalAuthorName: item.original_author.name,
  originalAuthorRole: item.original_author.role,
  originalTimestamp: item.original_timestamp,
});

/** コメント・メッセージの一覧と同じ間隔でポーリングし、編集/削除の反映に
 * 画面の再読み込みを不要にする。 */
const HISTORY_REFRESH_INTERVAL_MS = 1000;

/** コメントの変更履歴を全ページ取得し、comment_id ごとにグルーピングする。 */
export const useCommentHistory = (formId: string, answerId: string) => {
  const { items, hasMore, isLoadingMore, loadMore } = useInfiniteApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments/history',
    (cursor) => ({
      path: { form_id: formId, answer_id: answerId },
      query: cursor === undefined ? {} : { cursor },
    }),
    EMPTY_COMMENT_HISTORY_PAGE,
    { refreshInterval: HISTORY_REFRESH_INTERVAL_MS }
  );
  useAutoLoadAll(hasMore, isLoadingMore, loadMore);
  const hasCompletedInitialLoad = useHasCompletedInitialLoad(
    hasMore,
    isLoadingMore
  );
  const historyByTargetId = useMemo(
    () => groupByTargetId(items.map(toCommentHistoryViewModel)),
    [items]
  );

  return {
    historyByTargetId,
    isLoading: !hasCompletedInitialLoad,
  };
};

/** メッセージの変更履歴を全ページ取得し、message_id ごとにグルーピングする。 */
export const useMessageHistory = (formId: string, answerId: string) => {
  const { items, hasMore, isLoadingMore, loadMore } = useInfiniteApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages/history',
    (cursor) => ({
      path: { form_id: formId, answer_id: answerId },
      query: cursor === undefined ? {} : { cursor },
    }),
    EMPTY_MESSAGE_HISTORY_PAGE,
    { refreshInterval: HISTORY_REFRESH_INTERVAL_MS }
  );
  useAutoLoadAll(hasMore, isLoadingMore, loadMore);
  const hasCompletedInitialLoad = useHasCompletedInitialLoad(
    hasMore,
    isLoadingMore
  );
  const historyByTargetId = useMemo(
    () => groupByTargetId(items.map(toMessageHistoryViewModel)),
    [items]
  );

  return {
    historyByTargetId,
    isLoading: !hasCompletedInitialLoad,
  };
};
