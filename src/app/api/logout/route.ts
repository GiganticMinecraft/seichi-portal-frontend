import { BACKEND_SERVER_URL } from '@/env';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'SEICHI_PORTAL__SESSION_ID';

export const DELETE = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await fetch(`${BACKEND_SERVER_URL}/session`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((e) => console.error('Failed to delete backend session:', e));
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    maxAge: 0,
    path: '/',
  });

  return response;
};
