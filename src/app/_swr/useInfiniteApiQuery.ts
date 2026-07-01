'use client';

import * as React from 'react';
import useSWRInfinite from 'swr/infinite';

import { useHasHydrated } from '@/hooks/useHasHydrated';

import { typedFetcher } from './fetcher';
import type { GetPaths, GetParams, GetResponse } from './fetcher';

type KeysetPage<Item = unknown> = {
  items: Item[];
  next_cursor?: string | null;
};

/** items / next_cursor を返す Keyset Pagination エンドポイントのパスのみに絞り込む */
type KeysetPath = {
  [P in GetPaths]: GetResponse<P> extends KeysetPage ? P : never;
}[GetPaths];

/**
 * Keyset Pagination エンドポイントを無限スクロールで読み進めるための hook。
 * IntersectionObserver でスクロール終端の検知まで面倒を見て、監視対象の ref を返す。
 */
export const useInfiniteApiQuery = <P extends KeysetPath>(
  path: P,
  buildParams: (cursor: string | undefined) => GetParams<P>,
  initialPage: GetResponse<P>
) => {
  const hasHydrated = useHasHydrated();

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- KeysetPath 制約により GetResponse<P> は必ず { items, next_cursor } を持つが、TS はマップ型の分岐先まで戻って型を絞れないため境界として必要
  const asPage = (value: GetResponse<P>) => value as KeysetPage;

  const getKey = (
    _pageIndex: number,
    previousPageData: GetResponse<P> | null
  ) => {
    if (!hasHydrated) return null;
    const previousPage = previousPageData && asPage(previousPageData);
    if (previousPage && !previousPage.next_cursor) return null;

    const cursor = previousPage?.next_cursor ?? undefined;
    return [path, buildParams(cursor)] as const;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<
    GetResponse<P>,
    Error
  >(
    getKey,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- タプルキーの分割代入で P が失われ unknown に収束するため、呼び出し境界で戻す
    ([p, params]) => typedFetcher(p, params) as Promise<GetResponse<P>>,
    { fallbackData: [initialPage] }
  );

  type ItemsOf<T> = T extends { items: infer I } ? I : never;

  const pages = data ?? [initialPage];
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- asPage と同様、KeysetPath 制約により実際は items を持つが TS 上は絞り込めないため境界として必要
  const items = pages.flatMap((page) => asPage(page).items) as ItemsOf<
    GetResponse<P>
  >;
  const hasMore = Boolean(
    asPage(pages[pages.length - 1] ?? initialPage).next_cursor
  );

  const loadMore = React.useCallback(() => {
    if (hasMore && !isValidating) {
      void setSize(size + 1);
    }
  }, [hasMore, isValidating, setSize, size]);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  return {
    items,
    hasMore,
    isLoadingMore: isValidating,
    sentinelRef,
    loadMore,
  };
};
