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

export const typedFetcher = async <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
): Promise<GetResponse<P>> => {
  const { data, response } = await proxyClient.GET(path, params as never);

  if (!response.ok || data === undefined) {
    throw new HttpError({
      message: `Request failed: ${response.status}`,
      status: response.status,
      url: path,
    });
  }

  return data;
};
