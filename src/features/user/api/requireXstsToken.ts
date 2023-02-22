import {
  isOk,
  unwrapOk,
  createErr,
  Result,
  createOk,
  andThenAsyncForResult,
} from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';

import { jsonHeaders } from '@/const/headers';

import { requireXboxTokenResponse, XboxToken } from '../types';
import { NetworkError } from '../types/error';

const url = '/externalApi/xsts';

const genBodyWithToken = (xblToken: string) => ({
  Properties: {
    SandboxId: 'RETAIL',
    UserTokens: [xblToken],
  },
  RelyingParty: 'rp://api.minecraftservices.com/',
  TokenType: 'JWT',
});

export const requireXstsToken = async (
  xblToken: XboxToken,
): Promise<Result<XboxToken, Error>> => {
  const body = JSON.stringify(genBodyWithToken(xblToken.token));
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
  });
};
