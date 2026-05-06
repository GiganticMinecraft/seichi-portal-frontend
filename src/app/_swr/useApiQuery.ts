'use client';

import useSWR from 'swr';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { typedFetcher } from './fetcher';
import type { GetPaths, GetParams, GetResponse } from './fetcher';
import type { SWRConfiguration } from 'swr';

export const useApiQuery = <P extends GetPaths>(
  path: P,
  params?: GetParams<P>,
  options?: SWRConfiguration
) => {
  const hasHydrated = useHasHydrated();

  const pathParams =
    params && typeof params === 'object' && 'path' in params
      ? (params as { path?: Record<string, unknown> }).path
      : undefined;

  const hasEmptyPathParam =
    pathParams && Object.values(pathParams).some((v) => !v && v !== 0);

  const key =
    !hasHydrated || hasEmptyPathParam ? null : params ? [path, params] : [path];

  return useSWR<GetResponse<P>>(key, () => typedFetcher(path, params), options);
};
