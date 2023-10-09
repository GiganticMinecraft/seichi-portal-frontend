'use server';

import {
  minecraftAccessTokenResponseSchema,
  minecraftProfileResponseSchema,
  xboxLiveServiceTokenResponseSchema,
} from '@/schemas/loginSchema';

export const acquireXboxLiveToken = async (token: string) => {
  const URL = 'https://user.auth.xboxlive.com/user/authenticate';

  const response = await fetch(URL, {
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
  });

  const result = xboxLiveServiceTokenResponseSchema.parse(
    await response.json()
  );

  return { token: result.Token, userHash: result.DisplayClaims.xui[0].uhs };
};

export const acquireXboxServiceSecurityToken = async ({
  token,
}: Awaited<ReturnType<typeof acquireXboxLiveToken>>) => {
  const URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';

  const response = await fetch(URL, {
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
  });

  const result = xboxLiveServiceTokenResponseSchema.parse(
    await response.json()
  );

  return { token: result.Token, userHash: result.DisplayClaims.xui[0].uhs };
};

export const acquireMinecraftAccessToken = async ({
  token,
  userHash,
}: Awaited<ReturnType<typeof acquireXboxServiceSecurityToken>>) => {
  const URL =
    'https://api.minecraftservices.com/authentication/login_with_xbox';

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identityToken: `XBL3.0 x=${userHash};${token}`,
    }),
  });

  const result = minecraftAccessTokenResponseSchema.parse(
    await response.json()
  );

  return { token: result.access_token, expires: result.expires_in };
};

export const acquireMinecraftProfile = async ({
  token,
}: Awaited<ReturnType<typeof acquireMinecraftAccessToken>>) => {
  const URL = 'https://api.minecraftservices.com/minecraft/profile';

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = minecraftProfileResponseSchema.parse(await response.json());

  return result;
};

export const sendJsonToBackend = async ({
  token,
}: Awaited<ReturnType<typeof acquireMinecraftAccessToken>>) => {
  const URL = 'http://localhost:9000/forms';

  await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};
