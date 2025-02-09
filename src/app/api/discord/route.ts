'use server';

import {
  BACKEND_SERVER_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
} from '@/env';
import { NextRequest, NextResponse } from 'next/server';
import { discordTokenSchema } from '../_schemas/External';
import { getCachedToken } from '@/user-token/mcToken';

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

  const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body,
  });

  const token = discordTokenSchema.safeParse(await tokenResponse.json());

  if (!token.success) {
    return NextResponse.json({ error: 'Failed to get token' }, { status: 400 });
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
    }
  );

  if (!linkDiscordResponse.ok) {
    return NextResponse.json(
      { error: 'Failed to link discord' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(`${req.nextUrl.origin}/`);
}
