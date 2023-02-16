import { jsonHeaders } from '@/const/headers';

import { msAuthJson, MsAuthResult } from '../types';

const url = 'https://xsts.auth.xboxlive.com/xsts/authorize';

const getBodyWithToken = (xblToken: string) => ({
  Properties: {
    SandboxId: 'RETAIL',
    UserTokens: [xblToken],
  },
  RelyingParty: 'rp://api.minecraftservices.com/',
  TokenType: 'JWT',
});

export const getXstsToken = async (
  msAuth: MsAuthResult,
): Promise<MsAuthResult> => {
  const body = JSON.stringify(getBodyWithToken(msAuth.token));
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body,
  });
  if (!response.ok) throw new Error('');
  const res = msAuthJson.parse(response.json);

  return {
    token: res.Token,
    userHash: res.DisplayClaims.xui[0].uhs,
  };
};
