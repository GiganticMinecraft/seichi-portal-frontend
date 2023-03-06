import {
  createErr,
  andThenAsyncForResult,
  createOk,
  andThenForResult,
} from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';
import { NetworkError, ValidationError, WrappedResult } from '@/types';

import { overrideApiUrl } from '../libs/overrideApiUrl';
import { XboxToken, McAccessToken } from '../types';

const url = overrideApiUrl('mcToken');

const genBodyWithToken = (userHash: string, xstsToken: string) => ({
  identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
});

const requireMcAccessTokenResponse = z.object({
  access_token: z.string(),
});

export const requireMcAccessToken = async (
  xstsToken: XboxToken,
): Promise<WrappedResult<McAccessToken>> => {
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
      const parsedResponse = requireMcAccessTokenResponse.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(new ValidationError(parsedResponse.error));
      }

      return createOk({
        token: parsedResponse.data.access_token,
      });
    },
  );
};
