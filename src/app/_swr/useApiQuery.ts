'use client';

import useSWR from 'swr';
import { typedFetcher } from './fetcher';
import type { paths } from '@/generated/api-types';

type GetPaths = {
  [P in keyof paths]: paths[P] extends { get: unknown } ? P : never;
}[keyof paths];

type GetParams<P extends GetPaths> = paths[P] extends {
  get: { parameters?: infer Params };
}
  ? Params
  : never;

type GetResponse<P extends GetPaths> = paths[P] extends {
  get: {
    responses: {
      200: {
        content: {
          'application/json': infer R;
        };
      };
    };
  };
}
  ? R
  : never;

export const useApiQuery = <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
) => {
  const key = params ? [path, params] : [path];

  return useSWR<GetResponse<P>>(key, () => typedFetcher(path, params as never));
};
