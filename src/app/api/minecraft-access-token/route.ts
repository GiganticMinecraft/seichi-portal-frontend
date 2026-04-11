import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  minecraftAccessTokenResponseSchema,
  xboxLiveServiceTokenResponseSchema,
} from '@/_schemas/loginSchema';
import { BACKEND_SERVER_URL } from '@/env.server';
import type { NextRequest } from 'next/server';

const microsoftAccountTokenSchema = z.object({
  token: z.string().min(1),
});

class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody: unknown = await req.json().catch(() => null);
    const microsoftAccountToken =
      microsoftAccountTokenSchema.safeParse(requestBody);

    if (!microsoftAccountToken.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const xboxLiveTokenWithUserHash = await acquireXboxLiveTokenWithUserHash(
      microsoftAccountToken.data.token
    );
    const xboxServiceSecurityToken =
      await acquireXboxServiceSecurityTokenWithUserHash(
        xboxLiveTokenWithUserHash
      );
    const minecraftAccessTokenResult = await acquireMinecraftAccessToken(
      xboxServiceSecurityToken
    );

    const sessionResult = await createSession(minecraftAccessTokenResult);
    if (!sessionResult.ok) {
      console.error(
        'Failed to create backend session:',
        sessionResult.status,
        sessionResult.statusText
      );
      return NextResponse.json(
        { error: 'Failed to create backend session' },
        { status: 502 }
      );
    }

    const nextResponse = NextResponse.json({});
    const setCookieHeader = sessionResult.headers.get('Set-Cookie');

    if (setCookieHeader === null) {
      return NextResponse.json(
        { error: 'Backend session cookie was not returned' },
        { status: 502 }
      );
    }

    nextResponse.headers.set('Set-Cookie', setCookieHeader);
    return nextResponse;
  } catch (error) {
    console.error('Minecraft login flow failed:', error);
    if (error instanceof UpstreamServiceError || error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Failed during upstream authentication' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error during login' },
      { status: 500 }
    );
  }
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

  if (!response.ok) {
    throw new UpstreamServiceError(
      `Xbox Live auth failed with status ${response.status}`
    );
  }

  const body: unknown = await response.json().catch(() => null);
  const result = xboxLiveServiceTokenResponseSchema.parse(body);

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

  if (!response.ok) {
    throw new UpstreamServiceError(
      `XSTS auth failed with status ${response.status}`
    );
  }

  const body: unknown = await response.json().catch(() => null);
  const result = xboxLiveServiceTokenResponseSchema.parse(body);

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

  if (!response.ok) {
    throw new UpstreamServiceError(
      `Minecraft service auth failed with status ${response.status}`
    );
  }

  const body: unknown = await response.json().catch(() => null);
  const result = minecraftAccessTokenResponseSchema.parse(body);

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
