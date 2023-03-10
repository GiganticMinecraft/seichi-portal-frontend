import { MockedRequest, rest, RestHandler, DefaultBodyType } from 'msw';

import { BACKEND_API_URL } from '@/const/env';

const getRequest =
  (method: typeof rest.get) =>
  (
    path: string,
    response: Record<string, unknown> | unknown[] = {},
    status = 200,
    baseURL = BACKEND_API_URL,
  ): RestHandler<MockedRequest<DefaultBodyType>> =>
    method(`${baseURL}${path}`, (_req, res, ctx) =>
      res(ctx.status(status), ctx.json(response)),
    );

export const get = getRequest(rest.get);
