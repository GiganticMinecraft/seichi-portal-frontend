import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  minecraftAccessTokenResponseSchema,
  xboxLiveServiceTokenResponseSchema,
} from '@/_schemas/loginSchema';
import { getSeichiProxyHeaders } from '@/env.server';
import {
  authorizationHeader,
  BackendError,
  requireBackendResponse,
  serverApiClient,
} from '@/lib/server/backend';

const microsoftAccountTokenSchema = z.object({
  token: z.string().min(1),
  // Turnstile 未設定環境 (backend の TURNSTILE_ENABLED=false) では空文字列が届く。
  turnstileToken: z.string(),
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

    const sessionResponse = await createSession(
      minecraftAccessTokenResult,
      microsoftAccountToken.data.turnstileToken,
      req.headers
    );
    const nextResponse = NextResponse.json({});
    const setCookieHeader = sessionResponse.headers.get('Set-Cookie');

    if (setCookieHeader === null) {
      console.error(
        'Backend session response did not include a Set-Cookie header'
      );
      return NextResponse.json(
        {
          error: 'Backend session cookie was not returned',
          code: 'backend_unreachable',
        },
        { status: 502 }
      );
    }

    nextResponse.headers.set('Set-Cookie', setCookieHeader);
    return nextResponse;
  } catch (error) {
    console.error('Minecraft login flow failed:', error);

    if (error instanceof BackendError) {
      if (error.status === 429) {
        return backendRateLimitResponse(error);
      }

      if (error.status === 403) {
        return NextResponse.json(
          {
            error: 'Turnstile verification failed',
            code: 'turnstile_failed',
          },
          { status: 403 }
        );
      }

      const isBackendSideFailure =
        error.code === 'network_error' || error.status >= 500;

      if (isBackendSideFailure) {
        return NextResponse.json(
          {
            error: 'Failed to communicate with backend service',
            code: 'backend_unreachable',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create backend session', code: 'invalid_account' },
        { status: 502 }
      );
    }

    if (error instanceof UpstreamServiceError || error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Failed during upstream authentication',
          code: 'invalid_account',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error during login', code: 'backend_unreachable' },
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
  const requestedAt = Date.now();
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

  return {
    token: result.access_token,
    expiresAt: new Date(requestedAt + result.expires_in * 1000).toISOString(),
  };
};

const createSession = async (
  { token, expiresAt }: Awaited<ReturnType<typeof acquireMinecraftAccessToken>>,
  turnstileToken: string,
  requestHeaders?: Pick<Headers, 'get'>
) => {
  const { response } = await requireBackendResponse(
    serverApiClient.POST('/api/v1/session', {
      headers: {
        ...authorizationHeader(token),
        ...(requestHeaders ? getSeichiProxyHeaders(requestHeaders) : {}),
      },
      params: {
        header: { 'X-Seichi-Turnstile-Token': turnstileToken },
      },
      body: {
        expires_at: expiresAt,
      },
    })
  );

  return response;
};

const backendRateLimitResponse = (error: BackendError) => {
  const body = serializeBackendBody(error.body);
  const responseHeaders = new Headers();
  const contentType = error.headers.get('content-type');
  if (contentType) responseHeaders.set('content-type', contentType);

  for (const header of [
    'retry-after',
    'ratelimit-limit',
    'ratelimit-remaining',
    'ratelimit-reset',
  ]) {
    const value = error.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  // Keep the status and the rate-limit metadata even when the upstream body
  // is not valid JSON. The parser at the browser boundary handles either form.
  return new NextResponse(body, {
    status: 429,
    headers: responseHeaders,
  });
};

const serializeBackendBody = (body: unknown): string => {
  if (typeof body === 'string') return body;
  if (body === undefined) return '';
  return JSON.stringify(body);
};
