import { HttpError } from '@/lib/httpError';
import { proxyClient } from '@/lib/proxyClient';
import type { paths } from '@/generated/api-types';

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
  [P in keyof paths]: paths[P] extends { get: unknown } ? P : never;
}[keyof paths];

export type GetParams<P extends GetPaths> = paths[P] extends {
  get: { parameters?: infer Params };
}
  ? Params
  : never;

export type GetResponse<P extends GetPaths> = paths[P] extends {
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

type TypedClient = {
  GET<P extends GetPaths>(
    path: P,
    params?: GetParams<P>
  ): Promise<{
    data: GetResponse<P> | undefined;
    response: Response;
    error?: unknown;
  }>;
};

const typedClient = proxyClient as unknown as TypedClient;

export const typedFetcher = async <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
): Promise<GetResponse<P>> => {
  const result = await typedClient.GET(path, params);

  if (!result.response.ok || result.data === undefined) {
    throw new HttpError({
      message: `Request failed: ${result.response.status}`,
      status: result.response.status,
      url: path,
    });
  }

  return result.data;
};
