import {
  createErr,
  andThenAsyncForResult,
  createOk,
  andThenForResult,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';
import {
  BaseError,
  NetworkError,
  ValidationError,
  WrappedResult,
} from '@/types';

import { verifyAllSigns } from './verifyAllSigns';

import { McAccessToken } from '../types';

const url = '/externalApi/mcOwn';

const hasMcAccountResponse = z.object({
  signature: z.string(),
  keyId: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      signature: z.string(),
    }),
  ),
});

export const hasMcAccount = async (
  token: McAccessToken,
): Promise<WrappedResult<boolean>> => {
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
      const parsedResponse = hasMcAccountResponse.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(new ValidationError(parsedResponse.error));
      }

      const allSignsAreVerified = verifyAllSigns([
        parsedResponse.data.signature,
        ...parsedResponse.data.items.map(({ signature }) => signature),
      ]);
      if (!allSignsAreVerified) {
        return createErr(
          new BaseError('APIから受け取った署名の中に不正なものがあります'),
        );
      }

      return createOk(parsedResponse.data.items.length !== 0);
    },
  );
};
