'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';

type QueryValue = string | string[] | null | undefined;

/**
 * 現在の URL クエリパラメータを保ったまま、指定したキーだけを差し替えて
 * router.replace する。複数キーを同時に更新する場合は 1 回の呼び出しにまとめる
 * (searchParams の読み取りを ref 経由にして updateQuery の参照を安定させているため、
 * 個別に呼んでも直前の更新を取りこぼさない)。
 */
export const useUrlQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateQuery = useCallback(
    (updates: Record<string, QueryValue>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === null || value === undefined) continue;
        for (const v of Array.isArray(value) ? value : [value]) {
          params.append(key, v);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  return { searchParams, pathname, updateQuery };
};

/** 単一の文字列パラメータを URL と同期する。空文字/defaultValue のときはパラメータ自体を削除する。 */
export const useStringQueryParam = (
  key: string,
  defaultValue = ''
): [string, (value: string) => void] => {
  const { searchParams, updateQuery } = useUrlQuery();
  const value = searchParams.get(key) ?? defaultValue;
  const setValue = useCallback(
    (next: string) => {
      updateQuery({
        [key]: next === '' || next === defaultValue ? null : next,
      });
    },
    [key, defaultValue, updateQuery]
  );
  return [value, setValue];
};

/** 複数値を取りうるパラメータ(同じキーの繰り返し)を URL と同期する。 */
export const useArrayQueryParam = (
  key: string
): [string[], (values: string[]) => void] => {
  const { searchParams, updateQuery } = useUrlQuery();
  const values = useMemo(() => searchParams.getAll(key), [searchParams, key]);
  const setValues = useCallback(
    (next: string[]) => {
      updateQuery({ [key]: next.length > 0 ? next : null });
    },
    [key, updateQuery]
  );
  return [values, setValues];
};
