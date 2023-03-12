import { MockedRequest, rest, RestHandler, DefaultBodyType } from 'msw';

import { BACKEND_API_URL } from '@/const/env';

const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
type Method = (typeof methods)[number];
export type ResponseFunctionReturn = RestHandler<
  MockedRequest<DefaultBodyType>
>;
type ResponseFunction = (
  path: string,
  response?: Record<string, unknown> | unknown[],
  status?: number,
  baseURL?: string,
) => ResponseFunctionReturn;

const request =
  (method: Method): ResponseFunction =>
  (path, response = {}, status = 200, baseURL = BACKEND_API_URL) =>
    rest[method](`${baseURL}${path}`, (_req, res, ctx) =>
      res(ctx.status(status), ctx.json(response)),
    );

export const endPoints: {
  [m in Method]: ResponseFunction;
} = {
  get: request('get'),
  post: request('post'),
  put: request('put'),
  delete: request('delete'),
  patch: request('patch'),
};
