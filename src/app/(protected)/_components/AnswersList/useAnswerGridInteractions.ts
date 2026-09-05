'use client';

import { gridClasses } from '@mui/x-data-grid';
import type { GridApi, GridRowId } from '@mui/x-data-grid';
import * as React from 'react';

const SCROLL_END_THRESHOLD_PX = 200;

const scrollStorageKey = (key: string) => `answers-list-scroll:${key}`;
const lastViewedStorageKey = (key: string) => `answers-list-last-viewed:${key}`;

type GridApiRef = React.RefObject<GridApi | null>;

const getScroller = (apiRef: GridApiRef) =>
  apiRef.current?.rootElementRef.current?.querySelector(
    `.${gridClasses.virtualScroller}`
  );

/** Community 版 DataGrid には onRowsScrollEnd が無いため、内部の仮想スクロールコンテナを直接監視する */
export const useInfiniteScrollTrigger = ({
  apiRef,
  hasMore,
  onLoadMore,
}: {
  apiRef: GridApiRef;
  hasMore: boolean;
  onLoadMore: () => void;
}) => {
  React.useEffect(() => {
    if (!hasMore) return;

    const scroller = getScroller(apiRef);
    if (!scroller) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      if (scrollHeight - scrollTop - clientHeight < SCROLL_END_THRESHOLD_PX) {
        onLoadMore();
      }
    };

    scroller.addEventListener('scroll', handleScroll);
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [apiRef, hasMore, onLoadMore]);
};

/**
 * 一覧から離脱・復帰したときに、直前に開いていた行のハイライトとスクロール
 * 位置を復元する。scrollRestorationKey はフィルタ条件ごとに別々の状態を保持
 * するための識別キー(pathname + 検索クエリを想定)。
 */
export const useAnswerRowHighlightAndScroll = ({
  apiRef,
  rowCount,
  scrollRestorationKey,
}: {
  apiRef: GridApiRef;
  rowCount: number;
  scrollRestorationKey: string;
}) => {
  const hasRestoredScrollRef = React.useRef(false);

  // SSR 時点では sessionStorage を参照できないため、useHasHydrated と同様に
  // useSyncExternalStore でハイドレーション後の値へ安全に切り替える
  const highlightedRowId = React.useSyncExternalStore(
    () => () => {},
    () =>
      window.sessionStorage.getItem(lastViewedStorageKey(scrollRestorationKey)),
    () => null
  );

  // 詳細ページからブラウザバックで戻ったときに、離脱時のスクロール位置を復元する
  React.useEffect(() => {
    if (hasRestoredScrollRef.current || rowCount === 0) return;

    const scroller = getScroller(apiRef);
    if (!scroller) return;

    hasRestoredScrollRef.current = true;
    const saved = window.sessionStorage.getItem(
      scrollStorageKey(scrollRestorationKey)
    );
    if (saved !== null) {
      scroller.scrollTop = Number(saved);
    }
  }, [apiRef, rowCount, scrollRestorationKey]);

  React.useEffect(() => {
    const scroller = getScroller(apiRef);
    if (!scroller) return;

    const handleScroll = () => {
      window.sessionStorage.setItem(
        scrollStorageKey(scrollRestorationKey),
        String(scroller.scrollTop)
      );
    };
    scroller.addEventListener('scroll', handleScroll);
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [apiRef, scrollRestorationKey]);

  const registerRowView = (id: GridRowId) => {
    window.sessionStorage.setItem(
      lastViewedStorageKey(scrollRestorationKey),
      String(id)
    );
  };

  const isRowHighlighted = (id: GridRowId) => String(id) === highlightedRowId;

  return { registerRowView, isRowHighlighted };
};
