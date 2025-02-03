'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getUsersResponseSchema } from './app/api/_schemas/ResponseSchemas';
import { BACKEND_SERVER_URL } from './env';
import { getCachedToken } from './user-token/mcToken';

const proxy = async (request: NextRequest, token: string) => {
  const nextResponse = NextResponse.rewrite(
    `${BACKEND_SERVER_URL}${request.nextUrl.pathname.replace('/api/proxy', '')}`
  );

  nextResponse.headers.set('Authorization', `Bearer ${token}`);

  return nextResponse;
};

const fetchUser = async (token: string) => {
  return await fetch(`${BACKEND_SERVER_URL}/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  }).then(async (res) => getUsersResponseSchema.safeParse(await res.json()));
};

// NOTE: ここでやらなければならないのは
// - ミドルウェアを経由する処理はすべてログイン済みであることを保証すること(トークンが取得できる)
// - `/api/proxy` に対するリクエストはすべて seichi-portal-backend に転送すること
// - `/admin` に対するリクエストを行ったものは `ADMINISTRATOR` であることを保証すること
export const middleware = async (request: NextRequest) => {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?callbackUrl=${request.nextUrl.pathname}`
    );
  }

  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    return proxy(request, token);
  }

  const pathName = request.nextUrl.pathname.toLowerCase();

  const me = await fetchUser(token);

  if (!me.success) {
    console.error('Failed to parse user!');
    return NextResponse.redirect(`${request.nextUrl.origin}/internal-error`);
  }

  if (pathName.startsWith('/admin') && me.data.role !== 'ADMINISTRATOR') {
    return NextResponse.redirect(`${request.nextUrl.origin}/forbidden`);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/api/proxy/:path*', '/admin/:path*', '/forms/:path*'],
};
