import {
  Result,
  createErr,
  createOk,
  andThenAsyncForResult,
  andThenForResult,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';

import { jsonHeaders } from '@/const/headers';

import { requireXboxTokenResponse, XboxToken } from '../types';
import { NetworkError } from '../types/error';

const url = '/externalApi/xbl';

const genBodyWithToken = (token: string) => ({
  Properties: {
    AuthMethod: 'RPS',
    SiteName: 'user.auth.xboxlive.com',
    RpsTicket: `d=${token}`,
  },
  RelyingParty: 'http://auth.xboxlive.com',
  TokenType: 'JWT',
});

export const requireXblToken = async (
  token: string,
): Promise<Result<XboxToken, Error>> => {
  const body = JSON.stringify(genBodyWithToken(token));
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
      const parsedResponse = requireXboxTokenResponse.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(parsedResponse.error);
      }

      return createOk({
        token: parsedResponse.data.Token,
        userHash: parsedResponse.data.DisplayClaims.xui[0].uhs,
      });
    },
  );
};
