'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { BACKEND_SERVER_URL } from './env';
import { getCachedToken } from './features/user/api/mcToken';
import type { User } from './features/user/types/userSchema';

export const middleware = async (request: NextRequest) => {
  if (request.method !== 'GET') {
    return;
  }
  const pathName = request.nextUrl.pathname.toLowerCase();
  if (
    pathName === '/' ||
    pathName.startsWith('/login') ||
    pathName.includes('_next/static')
  ) {
    return;
  }

  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect(`${request.nextUrl.origin}/login`);
  }

  const me = await fetch(`${BACKEND_SERVER_URL}/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  }).then(async (res) => (await res.json()) as User);

  if (pathName.startsWith('/admin') && me.role !== 'ADMINISTRATOR') {
    return NextResponse.redirect(`${request.nextUrl.origin}/forbidden`);
  }

  return;
};
