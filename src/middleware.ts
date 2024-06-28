'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getUsersResponseSchema } from './app/api/_schemas/ResponseSchemas';
import { BACKEND_SERVER_URL } from './env';
import { getCachedToken } from './user-token/mcToken';

export const middleware = async (request: NextRequest) => {
  if (request.method !== 'GET') {
    return;
  }
  const pathName = request.nextUrl.pathname.toLowerCase();
  if (
    pathName === '/' ||
    pathName.startsWith('/login') ||
    pathName.startsWith('/logout') ||
    pathName.startsWith('/_next') ||
    pathName.startsWith('/internal-error') ||
    pathName.startsWith('/forbidden') ||
    pathName.startsWith('/unknown-error') ||
    pathName.startsWith('/badrequest') ||
    pathName.startsWith('/api')
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
  }).then(async (res) => getUsersResponseSchema.safeParse(await res.json()));

  if (!me.success) {
    return NextResponse.redirect(`${request.nextUrl.origin}/internal-error`);
  }

  if (pathName.startsWith('/admin') && me.data.role !== 'ADMINISTRATOR') {
    return NextResponse.redirect(`${request.nextUrl.origin}/forbidden`);
  }

  return;
};
