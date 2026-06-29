import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authorizationHeader, serverApiClient } from '@/lib/server/backend';

const SESSION_COOKIE = 'SEICHI_PORTAL__SESSION_ID';

export const DELETE = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await serverApiClient
      .DELETE('/api/v1/session', {
        headers: {
          ...authorizationHeader(token),
        },
      })
      .catch((e: unknown) => {
        console.error('Failed to delete backend session:', e);
      });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    maxAge: 0,
    path: '/',
  });

  return response;
};
