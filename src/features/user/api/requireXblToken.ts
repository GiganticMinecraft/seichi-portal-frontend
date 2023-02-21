import { jsonHeaders } from '@/const/headers';

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

export const requireXblToken = async (token: string): Promise<XboxToken> => {
  const body = JSON.stringify(genBodyWithToken(token));
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
