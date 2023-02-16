import { jsonHeaders } from '@/const/headers';

import { MsAccessToken, requireXboxTokenResponse, XboxToken } from '../types';

const url = 'https://user.auth.xboxlive.com/user/authenticate';

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
  token: MsAccessToken,
): Promise<XboxToken> => {
  const body = JSON.stringify(genBodyWithToken(token.token));
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body,
  });
  if (!response.ok) throw new Error('');
  const res = requireXboxTokenResponse.parse(response.json);

  return {
    token: res.Token,
    userHash: res.DisplayClaims.xui[0].uhs,
  };
};
