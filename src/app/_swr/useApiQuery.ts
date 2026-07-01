'use client';

import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';

import { useHasHydrated } from '@/hooks/useHasHydrated';

import { typedFetcher } from './fetcher';
import type { GetPaths, GetParams, GetResponse } from './fetcher';

export const useApiQuery = <P extends GetPaths>(
  path: P,
  params?: GetParams<P> | null,
  options?: SWRConfiguration
) => {
  const hasHydrated = useHasHydrated();

  const pathObj =
    params && typeof params === 'object' && 'path' in params
      ? params.path
      : undefined;

  const hasEmptyPathParam =
    pathObj && Object.values(pathObj).some((v) => !v && v !== 0);

  const key =
    !hasHydrated || params === null || hasEmptyPathParam
      ? null
      : params
        ? [path, params]
        : [path];

  return useSWR<GetResponse<P>, Error>(
    key,
    () => typedFetcher(path, params ?? undefined),
    options
  );
};
