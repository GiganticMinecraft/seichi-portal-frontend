import {
  isOk,
  unwrapOk,
  createErr,
  andThenAsyncForResult,
  createOk,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { XboxToken } from '../types';
import { NetworkError } from '../types/error';

const url = '/externalApi/mcToken';

const genBodyWithToken = (userHash: string, xstsToken: string) => ({
  identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
});

const requireMcAccessTokenResponse = z.object({
  access_token: z.string(),
});

export const requireMcAccessToken = async (xstsToken: XboxToken) => {
  const body = JSON.stringify(
    genBodyWithToken(xstsToken.userHash, xstsToken.token),
  );

  const responseResult = await tryCatchIntoResultWithEnsureErrorAsync(() =>
    fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body,
    }),
  );
  if (isOk(responseResult) && !unwrapOk(responseResult).ok) {
    const response = unwrapOk(responseResult);

    return createErr(new NetworkError(response.status, response.statusText));
  }

  return andThenAsyncForResult(responseResult, async (response) => {
    const parsedResponse = requireMcAccessTokenResponse.safeParse(
      await response.json(),
    );

    if (!parsedResponse.success) {
      return createErr(parsedResponse.error);
    }

    return createOk({
      token: parsedResponse.data.access_token,
    });
  });
};
