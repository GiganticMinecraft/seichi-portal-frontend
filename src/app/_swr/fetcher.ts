import { HttpError } from '@/lib/httpError';
import { proxyClient } from '@/lib/proxyClient';
import type { ApiPaths } from '@/lib/api/types';

/** @deprecated useApiQuery を使用してください */
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new HttpError({
      message: `Request failed: ${res.status}`,
      status: res.status,
      url,
    });
  }

  return res.json();
};

export type GetPaths = {
  [P in keyof ApiPaths]: ApiPaths[P] extends { get: unknown } ? P : never;
}[keyof ApiPaths];

export type GetParams<P extends GetPaths> = ApiPaths[P] extends {
  get: { parameters?: infer Params };
}
  ? Params
  : never;

export type GetResponse<P extends GetPaths> = ApiPaths[P] extends {
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

export const typedFetcher = async <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
): Promise<GetResponse<P>> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- GetPaths と PathsWithMethod<ApiPaths, "get"> は同じパス集合だが、ジェネリクス上で等価性を証明できないため型境界として必要
  const get = proxyClient.GET as (
    path: P,
    options?: { params?: GetParams<P> }
  ) => Promise<{
    data: GetResponse<P> | undefined;
    response: Response;
    error?: unknown;
  }>;

  const options = params === undefined ? undefined : { params };
  const result = await get(path, options);

  if (!result.response.ok || result.data === undefined) {
    throw new HttpError({
      message: `Request failed: ${result.response.status}`,
      status: result.response.status,
      url: path,
    });
  }

  return result.data;
};
