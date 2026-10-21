import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getDiscordConfig, getMsalOrigin } from '@/env.server';
import * as sdk from '@/generated/api/sdk.gen';
import { withResponse } from '@/lib/api/createApiClient';
import {
  getPostLoginRedirectFromRequest,
  setPostLoginRedirectCookie,
} from '@/lib/postLoginRedirect';
import { normalizeRedirectTarget } from '@/lib/redirect';
import { authorizationHeader, serverApiClient } from '@/lib/server/backend';
import {
  BACKEND_FETCH_TIMEOUT_MS,
  EXTERNAL_FETCH_TIMEOUT_MS,
  isTimeoutError,
  logUpstreamTimeout,
} from '@/lib/server/fetchTimeout';
import { getCachedToken } from '@/user-token/mcToken';

import { discordTokenSchema } from '../_schemas/External';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_OAUTH_STATE_COOKIE = 'SEICHI_PORTAL__DISCORD_OAUTH_STATE';
const DISCORD_RETURN_TO_COOKIE = 'SEICHI_PORTAL__DISCORD_RETURN_TO';

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

const setDiscordReturnToCookie = (response: NextResponse, returnTo: string) => {
  response.cookies.set(
    DISCORD_RETURN_TO_COOKIE,
    normalizeRedirectTarget(returnTo),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10,
    }
  );
};

const clearDiscordReturnToCookie = (response: NextResponse) => {
  response.cookies.set(DISCORD_RETURN_TO_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};

export async function GET(req: NextRequest) {
  const { clientId, clientSecret, redirectUri } = getDiscordConfig();
  const msalOrigin = getMsalOrigin();
  const seichiPortalToken = await getCachedToken(req.cookies);

  if (!seichiPortalToken) {
    const response = NextResponse.redirect(`${msalOrigin}/login`);
    setPostLoginRedirectCookie(response, getPostLoginRedirectFromRequest(req));
    return response;
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
    setDiscordReturnToCookie(response, searchParams.get('returnTo') ?? '/');
    return response;
  }

  const storedState = req.cookies.get(DISCORD_OAUTH_STATE_COOKIE)?.value;
  if (!state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(`${msalOrigin}/badrequest`);
    clearDiscordOauthStateCookie(response);
    clearDiscordReturnToCookie(response);
    return response;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  }).toString();

  // タイムアウト時にどちらの通信で詰まったかをログに残すため、現在の段階を記録する
  let stage: 'discord' | 'backend' = 'discord';

  try {
    const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body,
      cache: 'no-cache',
      signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
    });

    if (!tokenResponse.ok) {
      const response = NextResponse.json(
        { error: 'Failed to get token from Discord' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      clearDiscordReturnToCookie(response);
      return response;
    }

    // signal の上限はボディ読み取りにも掛かる。読み取り中のタイムアウトは
    // JSON 不正 (502) と区別して catch 節で 504 にする
    const tokenBody: unknown = await tokenResponse
      .json()
      .catch((error: unknown) => {
        if (isTimeoutError(error)) throw error;
        return null;
      });
    const token = discordTokenSchema.safeParse(tokenBody);

    if (!token.success) {
      const response = NextResponse.json(
        { error: 'Failed to parse token response from Discord' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      clearDiscordReturnToCookie(response);
      return response;
    }

    stage = 'backend';
    const { response: linkDiscordResponse } = await withResponse(
      sdk.linkDiscord({
        client: serverApiClient,
        headers: {
          ...authorizationHeader(seichiPortalToken),
        },
        body: {
          token: token.data.access_token,
        },
      })
    );

    if (!linkDiscordResponse.ok) {
      const response = NextResponse.json(
        { error: 'Failed to link discord account' },
        { status: 502 }
      );
      clearDiscordOauthStateCookie(response);
      clearDiscordReturnToCookie(response);
      return response;
    }

    const returnTo = normalizeRedirectTarget(
      req.cookies.get(DISCORD_RETURN_TO_COOKIE)?.value
    );
    const response = NextResponse.redirect(`${msalOrigin}${returnTo}`);
    clearDiscordOauthStateCookie(response);
    clearDiscordReturnToCookie(response);
    return response;
  } catch (error) {
    if (isTimeoutError(error)) {
      logUpstreamTimeout({
        upstream: stage,
        timeoutMs:
          stage === 'discord'
            ? EXTERNAL_FETCH_TIMEOUT_MS
            : BACKEND_FETCH_TIMEOUT_MS,
        route: '/api/discord',
      });
      const response = NextResponse.json(
        { error: 'Timed out during Discord link flow' },
        { status: 504 }
      );
      clearDiscordOauthStateCookie(response);
      clearDiscordReturnToCookie(response);
      return response;
    }

    console.error('Discord link flow failed:', error);
    const response = NextResponse.json(
      { error: 'Unexpected error during Discord link flow' },
      { status: 500 }
    );
    clearDiscordOauthStateCookie(response);
    clearDiscordReturnToCookie(response);
    return response;
  }
}
