import { MockedRequest, ResponseResolver, restContext } from 'msw';

import { formInfoList } from '../data';

export const mockListFormInfo: ResponseResolver<
  MockedRequest,
  typeof restContext
> = async (_req, res, ctx) => res(ctx.status(200), ctx.json(formInfoList));
