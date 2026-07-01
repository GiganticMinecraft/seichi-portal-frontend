import createClient from 'openapi-fetch';
import type { Client } from 'openapi-fetch';

import { getBackendServerUrl } from '@/env.server';
import type { ApiPaths } from '@/lib/api/types';

export class BackendError extends Error {
  status: number;
  code: 'http_error' | 'network_error';

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status: number;
    code: 'http_error' | 'network_error';
  }) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.code = code;
  }
}

type BackendFetchResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

export const createServerApiClient = () =>
  createClient<ApiPaths>({
    baseUrl: getBackendServerUrl(),
    cache: 'no-cache',
  });

let cachedServerApiClient: Client<ApiPaths> | undefined;

const getServerApiClient = (): Client<ApiPaths> => {
  cachedServerApiClient ??= createServerApiClient();
  return cachedServerApiClient;
};

export const serverApiClient: Client<ApiPaths> = new Proxy(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- モジュールインポート時の初期化を防ぐため、空オブジェクトをターゲットとして遅延初期化する
  {} as Client<ApiPaths>,
  {
    get(_target, property, receiver): unknown {
      return Reflect.get(getServerApiClient(), property, receiver);
    },
  }
);

export const authorizationHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const requireBackendData = async <T>(
  request: Promise<BackendFetchResult<T>>
): Promise<T> => {
  const { data } = await requireBackendResponse(request);

  if (data === undefined) {
    throw new BackendError({
      message: 'Backend request did not return a response body',
      status: 502,
      code: 'http_error',
    });
  }

  return data;
};

type KeysetPage<T> = {
  items: T[];
  next_cursor?: string | null;
};

/**
 * Keyset Pagination の全ページを cursor が尽きるまで辿り、items を1つの配列にまとめて返す。
 * バックエンドが1リクエストあたり返す件数を絞るようになったため、従来通り一覧を丸ごと必要とする
 * 呼び出し元との互換を保つために用意している。
 */
export const requireAllBackendPages = async <T>(
  fetchPage: (cursor?: string) => Promise<BackendFetchResult<KeysetPage<T>>>
): Promise<T[]> => {
  const items: T[] = [];
  let cursor: string | undefined;

  for (;;) {
    const page = await requireBackendData(fetchPage(cursor));
    items.push(...page.items);

    if (!page.next_cursor) {
      return items;
    }

    cursor = page.next_cursor;
  }
};

export const requireBackendResponse = async <T>(
  request: Promise<BackendFetchResult<T>>
): Promise<BackendFetchResult<T>> => {
  try {
    const result = await request;

    if (!result.response.ok) {
      throw new BackendError({
        message: `Backend request failed with status ${result.response.status}`,
        status: result.response.status,
        code: 'http_error',
      });
    }

    return result;
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }

    throw new BackendError({
      message: 'Backend request failed due to a network error',
      status: 503,
      code: 'network_error',
    });
  }
};
