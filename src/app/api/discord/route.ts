import { NextResponse } from 'next/server';
import {
  BACKEND_SERVER_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
} from '@/env.server';
import { getCachedToken } from '@/user-token/mcToken';
import { discordTokenSchema } from '../_schemas/External';
import type { NextRequest } from 'next/server';

const OAUTH_QUERY = new URLSearchParams({
  client_id: DISCORD_CLIENT_ID,
  redirect_uri: DISCORD_REDIRECT_URI,
  response_type: 'code',
  scope: 'identify',
}).toString();

const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?${OAUTH_QUERY}`;
const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';

export async function GET(req: NextRequest) {
  const seichiPortalToken = await getCachedToken();
  if (!seichiPortalToken) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/login?callbackUrl=${req.nextUrl.pathname}`
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (code === null) {
    return NextResponse.redirect(DISCORD_OAUTH_URL);
  }

  const body = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: DISCORD_REDIRECT_URI,
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
      return NextResponse.json(
        { error: 'Failed to get token from Discord' },
        { status: 502 }
      );
    }

    const tokenBody: unknown = await tokenResponse.json().catch(() => null);
    const token = discordTokenSchema.safeParse(tokenBody);

    if (!token.success) {
      return NextResponse.json(
        { error: 'Failed to parse token response from Discord' },
        { status: 502 }
      );
    }

    const linkDiscordResponse = await fetch(
      `${BACKEND_SERVER_URL}/link-discord`,
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
      return NextResponse.json(
        { error: 'Failed to link discord account' },
        { status: 502 }
      );
    }

    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  } catch (error) {
    console.error('Discord link flow failed:', error);
    return NextResponse.json(
      { error: 'Unexpected error during Discord link flow' },
      { status: 500 }
    );
  }
}
