import { jsonHeaders } from '@/const/headers';

import { requireXboxTokenResponse, XboxToken } from '../types';

const url = 'https://xsts.auth.xboxlive.com/xsts/authorize';

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
): Promise<XboxToken> => {
  const body = JSON.stringify(genBodyWithToken(xblToken.token));
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body,
  });
  if (!response.ok)
    throw new Error(`Network Error: ${response.status} ${response.statusText}`);
  const res = requireXboxTokenResponse.parse(await response.json());

  return {
    token: res.Token,
    userHash: res.DisplayClaims.xui[0].uhs,
  };
};
