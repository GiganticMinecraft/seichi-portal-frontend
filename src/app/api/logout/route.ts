import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import * as sdk from '@/generated/api/sdk.gen';
import { authorizationHeader, serverApiClient } from '@/lib/server/backend';
import { SESSION_COOKIE_NAME } from '@/user-token/mcToken';

export const DELETE = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await sdk
      .endSession({
        client: serverApiClient,
        headers: {
          ...authorizationHeader(token),
        },
      })
      .catch((e: unknown) => {
        console.error('Failed to delete backend session:', e);
      });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
};
