import {
  andThenAsyncForResult,
  andThenForResult,
  createErr,
  createOk,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';
import { NetworkError } from '@/types';

import { McAccessToken } from '../types';

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

  return andThenAsyncForResult(
    andThenForResult(responseResult, (response) => {
      if (!response.ok) {
        return createErr(
          new NetworkError(response.status, response.statusText),
        );
      }

      return createOk(response);
    }),
    async (response) => {
      const parsedResponse = responseJsonSchema.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(parsedResponse.error);
      }

      return createOk({
        id: parsedResponse.data.id,
        name: parsedResponse.data.name,
      });
    },
  );
};
