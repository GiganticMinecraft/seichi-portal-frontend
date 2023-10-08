'use server';

import {
  minecraftAccessTokenResponseSchema,
  xboxLiveServiceTokenResponseSchema,
} from '@/schemas/loginSchema';

export const acquireXboxLiveToken = async (token: string) => {
  const URL = 'https://user.auth.xboxlive.com/user/authenticate';

  const json = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: `d=${token}`,
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT',
    }),
  }).then(async (r) => r.json());

  const result = xboxLiveServiceTokenResponseSchema.parse(json);

  return { token: result.Token, userHash: result.DisplayClaims.xui[0].uhs };
};

export const acquireXboxServiceSecurityToken = async ({
  token,
}: Awaited<ReturnType<typeof acquireXboxLiveToken>>) => {
  const URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';

  const json = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [token],
      },
      RelyingParty: 'rp://api.minecraftservices.com/',
      TokenType: 'JWT',
    }),
  }).then(async (r) => r.json());

  const result = xboxLiveServiceTokenResponseSchema.parse(json);

  return { token: result.Token, userHash: result.DisplayClaims.xui[0].uhs };
};

export const acquireMinecraftAccessToken = async ({
  token,
  userHash,
}: Awaited<ReturnType<typeof acquireXboxServiceSecurityToken>>) => {
  const URL =
    'https://api.minecraftservices.com/authentication/login_with_xbox';

  const json = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identityToken: `XBL3.0 x=${userHash};${token}`,
    }),
  }).then(async (r) => r.json());

  const result = minecraftAccessTokenResponseSchema.parse(json);

  return { token: result.access_token };
};
