import { NextResponse } from 'next/server';
import { getBackendServerUrl, getDiscordConfig } from '@/env.server';
import { getCachedToken } from '@/user-token/mcToken';
import { discordTokenSchema } from '../_schemas/External';
import type { NextRequest } from 'next/server';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_OAUTH_STATE_COOKIE = 'SEICHI_PORTAL__DISCORD_OAUTH_STATE';

const setDiscordOauthStateCookie = (response: NextResponse, state: string) => {
  response.cookies.set(DISCORD_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  });
};

const clearDiscordOauthStateCookie = (response: NextResponse) => {
  response.cookies.set(DISCORD_OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};

export async function GET(req: NextRequest) {
  const { clientId, clientSecret, redirectUri } = getDiscordConfig();
  const backendServerUrl = getBackendServerUrl();
  const seichiPortalToken = await getCachedToken(req.cookies);

  if (!seichiPortalToken) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/login?callbackUrl=${req.nextUrl.pathname}`
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (code === null) {
    const oauthState = crypto.randomUUID();
    const oauthQuery = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify',
      state: oauthState,
    }).toString();
    const response = NextResponse.redirect(
      `https://discord.com/oauth2/authorize?${oauthQuery}`
    );
    setDiscordOauthStateCookie(response, oauthState);
    return response;
  }

  const storedState = req.cookies.get(DISCORD_OAUTH_STATE_COOKIE)?.value;
  if (!state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(`${req.nextUrl.origin}/badrequest`);
    clearDiscordOauthStateCookie(response);
    return response;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  }).toString();

  try {
    const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body,
      cache: 'no-cache',
    });

    if (!tokenResponse.ok) {
      const response = NextResponse.json(
        { error: 'Failed to get token from Discord' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      return response;
    }

    const tokenBody: unknown = await tokenResponse.json().catch(() => null);
    const token = discordTokenSchema.safeParse(tokenBody);

    if (!token.success) {
      const response = NextResponse.json(
        { error: 'Failed to parse token response from Discord' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      return response;
    }

    const linkDiscordResponse = await fetch(
      `${backendServerUrl}/link-discord`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${seichiPortalToken}`,
        },
        body: JSON.stringify({
          token: token.data.access_token,
        }),
        cache: 'no-cache',
      }
    );

    if (!linkDiscordResponse.ok) {
      const response = NextResponse.json(
        { error: 'Failed to link discord account' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      return response;
    }

    const response = NextResponse.redirect(`${req.nextUrl.origin}/`);
    clearDiscordOauthStateCookie(response);
    return response;
  } catch (error) {
    console.error('Discord link flow failed:', error);
    const response = NextResponse.json(
      { error: 'Unexpected error during Discord link flow' },
      { status: 500 }
    );
    clearDiscordOauthStateCookie(response);
    return response;
  }
}
