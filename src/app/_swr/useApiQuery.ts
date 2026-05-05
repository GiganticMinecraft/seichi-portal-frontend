'use client';

import useSWR from 'swr';
import { typedFetcher } from './fetcher';
import type { GetPaths, GetParams, GetResponse } from './fetcher';

export const useApiQuery = <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
) => {
  const key = params ? [path, params] : [path];

  return useSWR<GetResponse<P>>(key, () => typedFetcher(path, params));
};
