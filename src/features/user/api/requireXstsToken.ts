import {
  createErr,
  createOk,
  andThenAsyncForResult,
} from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';
import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';
import {
  BaseError,
  NetworkError,
  ValidationError,
  WrappedResult,
} from '@/types';

import { overrideApiUrl } from '../libs/overrideApiUrl';
import { requireXboxTokenResponse, XboxToken } from '../types';

const url = overrideApiUrl('xsts');

const unAuthorizedBodySchema = z.object({
  Identity: z.string(),
  XErr: z.number(),
  Message: z.string(),
});

const unauthorizedErrorCodes: Record<number, string> = {
  2148916233: 'あなたのMicrosoftアカウントにはXboxアカウントが含まれていません',
  2148916235: 'お住まいの国ではXboxLiveをご利用いただけません',
  2148916236: '年齢認証が必要です',
  2148916237: '年齢認証が必要です',
  2148916238:
    'あなたのMicrosoftアカウントは、年齢制限のため、保護者のMicrosoftアカウントに結び付けられる必要があります',
};

const genSuccessBodyWithToken = (xblToken: string) => ({
  Properties: {
    SandboxId: 'RETAIL',
    UserTokens: [xblToken],
  },
  RelyingParty: 'rp://api.minecraftservices.com/',
  TokenType: 'JWT',
});

export const requireXstsToken = async (
  xblToken: XboxToken,
): Promise<WrappedResult<XboxToken>> => {
  const body = JSON.stringify(genSuccessBodyWithToken(xblToken.token));
  const responseResult = await tryCatchIntoResultWithEnsureErrorAsync(() =>
    fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body,
    }),
  );

  return andThenAsyncForResult(
    await andThenAsyncForResult(responseResult, async (response) => {
      if (response.ok) {
        return createOk(response);
      }
      if (response.status !== 401) {
        return createErr(
          new NetworkError(response.status, response.statusText),
        );
      }

      const parsedResponse = unAuthorizedBodySchema.safeParse(
        await response.json(),
      );

      if (!parsedResponse.success) {
        return createErr(parsedResponse.error);
      }

      const message =
        unauthorizedErrorCodes[parsedResponse.data.XErr] ??
        'XBoxのセキュリティトークンを取得中に、認証に失敗しました（原因不明）';

      return createErr(new BaseError(message));
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
        userHash: parsedResponse.data.DisplayClaims.xui[0].uhs,
      });
    },
  );
};
