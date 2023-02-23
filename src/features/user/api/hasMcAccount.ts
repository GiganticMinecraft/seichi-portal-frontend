import {
  createErr,
  andThenAsyncForResult,
  createOk,
  andThenForResult,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { McAccessToken } from '../types';
import { NetworkError } from '../types/error';

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

export const hasMcAccount = async (token: McAccessToken) => {
  const responseResult = await tryCatchIntoResultWithEnsureErrorAsync(() =>
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: jsonHeaders.Accept,
        Authorization: `Bearer ${token.token}`,
      },
    }),
  );

  // TODO: the signature should always be checked with the public key from Mojang to verify that it is a legitimate response from the official servers

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
        return createErr(parsedResponse.error);
      }

      return createOk(parsedResponse.data.items.length !== 0);
    },
  );
};
