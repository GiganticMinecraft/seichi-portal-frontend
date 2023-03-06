import {
  andThenAsyncForResult,
  andThenForResult,
  createErr,
  createOk,
} from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';
import { NetworkError, ValidationError, WrappedResult } from '@/types';

import { overrideApiUrl } from '../libs/overrideApiUrl';
import { McAccessToken, McProfile, MinecraftIdIsUndefined } from '../types';

const url = overrideApiUrl('mcProfile');

const responseJsonSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getMcProfile = async (
  token: McAccessToken,
): Promise<WrappedResult<McProfile>> => {
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
      if (response.ok) {
        return createOk(response);
      }
      if (response.status === 404) {
        return createErr(new MinecraftIdIsUndefined());
      }

      return createErr(new NetworkError(response.status, response.statusText));
    }),
    async (response) => {
      const parsedResponse = responseJsonSchema.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(new ValidationError(parsedResponse.error));
      }

      return createOk({
        id: parsedResponse.data.id,
        name: parsedResponse.data.name,
      });
    },
  );
};
