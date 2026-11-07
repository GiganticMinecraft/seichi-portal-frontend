import type { Revalidator, RevalidatorOptions } from 'swr';

import { isHttpError } from '@/lib/httpError';

const MAX_TIMEOUT_MS = 2_147_483_647;

const retryAfterRateLimit = (
  error: unknown,
  revalidate: Revalidator,
  options: Required<RevalidatorOptions>
) => {
  if (!isHttpError(error) || error.status !== 429) return false;

  const retryAfter = error.retryAfter;
  if (retryAfter === undefined) return true;

  const retryDelayMs = Math.min(retryAfter * 1000, MAX_TIMEOUT_MS);
  setTimeout(
    () => {
      void revalidate({ ...options, retryCount: options.retryCount + 1 });
    },
    Math.max(retryDelayMs, 1)
  );
  return true;
};

/**
 * アプリ全体の SWR の再試行方針 (`SWRConfig` の `onErrorRetry`)。
 * 429 は Retry-After に従い、それ以外は 5 秒間隔で 3 回まで再試行する。
 */
export const retryOnError = (
  error: unknown,
  _key: string,
  _config: unknown,
  revalidate: Revalidator,
  options: Required<RevalidatorOptions>
): void => {
  if (retryAfterRateLimit(error, revalidate, options)) return;
  if (options.retryCount >= 3) return;
  setTimeout(() => {
    void revalidate({
      ...options,
      retryCount: options.retryCount + 1,
    });
  }, 5000);
};

/**
 * 404 だけ再試行しない [`retryOnError`]。
 *
 * 回答詳細のように、通知や検索結果のリンク先がアーカイブ済み・削除済みで 404 になりうる
 * 画面で使う。404 は時間を置いても変わらないので、同じ 404 を 5 秒ごとに引き直すのを避ける。
 */
export const retryUnlessNotFound: typeof retryOnError = (
  error,
  key,
  config,
  revalidate,
  options
) => {
  if (isHttpError(error) && error.status === 404) return;
  retryOnError(error, key, config, revalidate, options);
};
