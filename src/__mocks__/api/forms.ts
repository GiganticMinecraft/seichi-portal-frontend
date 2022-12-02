import { MockedRequest, ResponseResolver, restContext, RestRequest } from 'msw';

import { formInfoList, formList } from '../data';

export const mockListFormInfo: ResponseResolver<
  MockedRequest,
  typeof restContext
> = async (_req, res, ctx) => res(ctx.status(200), ctx.json(formInfoList));

export const mockShowForm: ResponseResolver<
  RestRequest,
  typeof restContext
> = async (req, res, ctx) => {
  const formId = Number(req.params.formId);
  const result = formList.find((f) => f.id.valueOf() === formId);

  return result
    ? res(ctx.status(200), ctx.json(result))
    : res(ctx.status(404), ctx.json({}));
};
