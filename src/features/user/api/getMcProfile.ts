import {
  andThenAsyncForResult,
  createErr,
  createOk,
  isOk,
  unwrapOk,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { McAccessToken } from '../types';
import { NetworkError } from '../types/error';

const url = '/externalApi/mcProfile';

const responseJsonSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getMcProfile = async (token: McAccessToken) => {
  const responseResult = await tryCatchIntoResultWithEnsureErrorAsync(() =>
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: jsonHeaders.Accept,
        Authorization: `Bearer ${token.token}`,
      },
    }),
  );
  if (isOk(responseResult) && !unwrapOk(responseResult).ok) {
    const response = unwrapOk(responseResult);

    return createErr(new NetworkError(response.status, response.statusText));
  }

  return andThenAsyncForResult(responseResult, async (response) => {
    const parsedResponse = responseJsonSchema.safeParse(await response.json());

    if (!parsedResponse.success) {
      return createErr(parsedResponse.error);
    }

    return createOk({
      id: parsedResponse.data.id,
      name: parsedResponse.data.name,
    });
  });
};
