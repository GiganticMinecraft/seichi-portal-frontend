import { NextResponse } from 'next/server';
import {
  minecraftAccessTokenResponseSchema,
  xboxLiveServiceTokenResponseSchema,
} from '@/_schemas/loginSchema';
import { BACKEND_SERVER_URL } from '@/env';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const microsoftAccountToken = (await req.json()) as { token: string };

  const xboxLiveTokenWithUserHash = await acquireXboxLiveTokenWithUserHash(
    microsoftAccountToken.token
  );
  const xboxServiceSecurityToken =
    await acquireXboxServiceSecurityTokenWithUserHash(
      xboxLiveTokenWithUserHash
    );
  const minecraftAccessTokenResult = await acquireMinecraftAccessToken(
    xboxServiceSecurityToken
  );

  const sessionResult = await createSession(minecraftAccessTokenResult);
  const nextResponse = NextResponse.json({});

  const setCookieHeader = sessionResult.headers.get('Set-Cookie');

  if (setCookieHeader === null) {
    return NextResponse.redirect(`${req.nextUrl.origin}/internal-error`);
  } else {
    nextResponse.headers.set('Set-Cookie', setCookieHeader);
  }

  return nextResponse;
}

const acquireXboxLiveTokenWithUserHash = async (token: string) => {
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

const acquireXboxServiceSecurityTokenWithUserHash = async ({
  token,
}: Awaited<ReturnType<typeof acquireXboxLiveTokenWithUserHash>>) => {
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

const acquireMinecraftAccessToken = async ({
  token,
  userHash,
}: Awaited<ReturnType<typeof acquireXboxServiceSecurityTokenWithUserHash>>) => {
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

const createSession = async ({
  token,
  expires,
}: Awaited<ReturnType<typeof acquireMinecraftAccessToken>>) => {
  return await fetch(`${BACKEND_SERVER_URL}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      expires: expires,
    }),
    cache: 'no-cache',
  });
};
