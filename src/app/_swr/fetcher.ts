import type { GetOperations } from '@/generated/api/get-operations.gen';
import { withResponse } from '@/lib/api/createApiClient';
import { HttpError } from '@/lib/httpError';
import { proxyClient } from '@/lib/proxyClient';

export type GetPaths = keyof GetOperations;

export type GetParams<P extends GetPaths> = Pick<
  GetOperations[P]['data'],
  'path' | 'query'
>;

export type GetResponse<P extends GetPaths> = GetOperations[P]['response'];

export const typedFetcher = async <P extends GetPaths>(
  path: P,
  params?: GetParams<P>
): Promise<GetResponse<P>> => {
  // SDK 関数ではなくクライアントの get を使い、パス文字列をキーにした SWR から呼べるようにする。
  // 型の対応は scripts/codegen.ts が SDK から生成する GetOperations が担保する
  const result = await withResponse(
    proxyClient.get<{ 200: GetResponse<P> }>({
      url: path,
      // exactOptionalPropertyTypes のため、値が無いキーは渡さない
      ...(params?.path === undefined ? {} : { path: params.path }),
      ...(params?.query === undefined ? {} : { query: params.query }),
    })
  );

  if (!result.response.ok || result.data === undefined) {
    throw new HttpError({
      message: `Request failed: ${result.response.status}`,
      status: result.response.status,
      url: path,
      body: result.error,
      headers: result.response.headers,
    });
  }

  return result.data;
};
