import { jsonHeaders } from '@/const/headers';

import { msAuthJson, MsAuthResult } from '../types';

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

export const authXbox = async (accessToken: string): Promise<MsAuthResult> => {
  const body = JSON.stringify(genBodyWithToken(accessToken));
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
