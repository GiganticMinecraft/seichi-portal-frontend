import {
  createErr,
  createOk,
  andThenAsyncForResult,
  andThenForResult,
} from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';

import { jsonHeaders } from '@/const/headers';
import { NetworkError, ValidationError, WrappedResult } from '@/types';

import { requireXboxTokenResponse, XboxToken } from '../types';

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
): Promise<WrappedResult<XboxToken>> => {
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
        return createErr(new ValidationError(parsedResponse.error));
      }

      return createOk({
        token: parsedResponse.data.Token,
        // 型スキーマで空ではないことを保証しているので、このNonNullAssertionは安全
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userHash: parsedResponse.data.DisplayClaims.xui[0]!.uhs,
      });
    },
  );
};
