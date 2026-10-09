import { createClient, createConfig } from '@/generated/api/client';
import type { Client, Config } from '@/generated/api/client';

/**
 * backend API 用の hey-api クライアントを作る。
 *
 * hey-api のクライアントは fetch 自体の失敗 (ネットワークエラー) も握りつぶして
 * `{ error, response: undefined }` を返すが、呼び出し側は `response` が必ずある前提で
 * 書かれている (requireBackendResponse はネットワークエラーを例外で受け取る)。
 * そのため response が無いエラーだけは例外として投げ直し、従来 (openapi-fetch) と同じく
 * Promise を reject させる。HTTP エラー (4xx / 5xx) は従来どおり `error` に入れて返す。
 */
export const createApiClient = (config: Config): Client => {
  const client = createClient(createConfig(config));

  client.interceptors.error.use((error, response) => {
    if (response === undefined) {
      throw error;
    }

    return error;
  });

  return client;
};

/**
 * SDK 関数の戻り値から `response` を必須にする。
 *
 * hey-api の型では通信エラー時のために `response` が省略可能だが、
 * createApiClient の error interceptor が通信エラーを例外として投げ直すため、
 * 解決した結果には必ず `response` がある。その前提を型に反映する。
 */
export const withResponse = async <T extends { response?: Response }>(
  request: Promise<T>
): Promise<T & { response: Response }> => {
  const result = await request;
  const { response } = result;

  if (response === undefined) {
    throw new Error('backend request finished without a response');
  }

  return { ...result, response };
};
