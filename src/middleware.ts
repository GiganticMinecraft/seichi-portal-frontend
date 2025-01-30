'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getUsersResponseSchema } from './app/api/_schemas/ResponseSchemas';
import { BACKEND_SERVER_URL } from './env';
import { getCachedToken } from './user-token/mcToken';

const proxy = async (request: NextRequest) => {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const nextResponse = NextResponse.rewrite(
    `${BACKEND_SERVER_URL}${request.nextUrl.pathname.replace('/api/proxy', '')}`
  );

  nextResponse.headers.set('Authorization', `Bearer ${token}`);

  return nextResponse;
};

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    return proxy(request);
  }

  if (request.method !== 'GET') {
    return;
  }

  const pathName = request.nextUrl.pathname.toLowerCase();
  const ignorePaths = [
    '/_next',
    '/favicon.ico',
    '/login',
    '/logout',
    '/internal-error',
    '/forbidden',
    '/unknown-error',
    '/badrequest',
  ];

  if (
    pathName === '/' ||
    ignorePaths.some((path) => pathName.startsWith(path))
  ) {
    return;
  }

  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?callbackUrl=${request.nextUrl.pathname}`
    );
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
