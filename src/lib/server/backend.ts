import { getBackendServerUrl } from '@/env.server';
import type { Client } from '@/generated/api/client';
import { createApiClient } from '@/lib/api/createApiClient';
import {
  getProblemDetails,
  getRateLimitResetSeconds,
  getRetryAfterSeconds,
} from '@/lib/httpError';

export class BackendError extends Error {
  status: number;
  code: 'http_error' | 'network_error';
  body: unknown;
  headers: Headers;
  errorCode: string | undefined;
  detail: string | undefined;
  retryAfter: number | undefined;
  rateLimitReset: number | undefined;

  constructor({
    message,
    status,
    code,
    body,
    headers,
  }: {
    message: string;
    status: number;
    code: 'http_error' | 'network_error';
    body?: unknown;
    headers?: Headers;
  }) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.code = code;
    this.body = body;
    this.headers = headers ?? new Headers();
    this.retryAfter = getRetryAfterSeconds(this.headers);
    this.rateLimitReset = getRateLimitResetSeconds(this.headers);

    const problemDetails = getProblemDetails(body);
    this.errorCode = problemDetails.errorCode;
    this.detail = problemDetails.detail;
  }
}

// exactOptionalPropertyTypes 下で hey-api の結果型 (`data: undefined` を含む union) を
// 受け取れるよう、省略可能なプロパティに undefined を明示する
type BackendFetchResult<T> = {
  data?: T | undefined;
  error?: unknown;
  // hey-api の型では通信エラー時のため省略可能。実際には createApiClient の
  // error interceptor が通信エラーを例外にするため、解決した結果には必ずある
  response?: Response | undefined;
};

type BackendSuccessResult<T> = BackendFetchResult<T> & { response: Response };

export const createServerApiClient = () =>
  createApiClient({
    baseUrl: getBackendServerUrl(),
    cache: 'no-cache',
  });

let cachedServerApiClient: Client | undefined;

const getServerApiClient = (): Client => {
  cachedServerApiClient ??= createServerApiClient();
  return cachedServerApiClient;
};

export const serverApiClient: Client = new Proxy(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- モジュールインポート時の初期化を防ぐため、空オブジェクトをターゲットとして遅延初期化する
  {} as Client,
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
): Promise<BackendSuccessResult<T>> => {
  try {
    const result = await request;
    const { response } = result;

    if (response === undefined) {
      // catch 節で network_error に変換する
      throw new Error('backend request finished without a response');
    }

    if (!response.ok) {
      throw new BackendError({
        message: `Backend request failed with status ${response.status}`,
        status: response.status,
        code: 'http_error',
        body: result.error,
        headers: response.headers,
      });
    }

    return { ...result, response };
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
