import { NextResponse, type NextRequest } from 'next/server';
import { BACKEND_SERVER_URL } from './env.server';
import { getCachedToken } from './user-token/mcToken';
import { schemas } from './generated/api-client';

const getUsersResponseSchema = schemas.UserInfoResponse;

type FetchUserResult =
  | { kind: 'ok'; user: typeof getUsersResponseSchema._type }
  | { kind: 'unauthorized' }
  | { kind: 'error' };

const proxyToBackend = (request: NextRequest, token: string) => {
  const nextResponse = NextResponse.rewrite(
    `${BACKEND_SERVER_URL}${request.nextUrl.pathname.replace(
      '/api/proxy',
      ''
    )}${request.nextUrl.search}`
  );

  nextResponse.headers.set('Authorization', `Bearer ${token}`);

  return nextResponse;
};

const fetchUser = async (token: string) => {
  try {
    const response = await fetch(`${BACKEND_SERVER_URL}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    });

    if (response.status === 401) {
      return { kind: 'unauthorized' } satisfies FetchUserResult;
    }

    if (!response.ok) {
      console.error('Failed to fetch user from backend:', response.status);
      return { kind: 'error' } satisfies FetchUserResult;
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = getUsersResponseSchema.safeParse(body);

    if (!parsed.success) {
      console.error('Failed to parse user response from backend');
      return { kind: 'error' } satisfies FetchUserResult;
    }

    return { kind: 'ok', user: parsed.data } satisfies FetchUserResult;
  } catch (error) {
    console.error('Failed to fetch user from backend:', error);
    return { kind: 'error' } satisfies FetchUserResult;
  }
};

// NOTE: ここでやらなければならないのは
// - ミドルウェアを経由する処理はすべてログイン済みであることを保証すること(トークンが取得できる)
// - `/api/proxy` に対するリクエストはすべて seichi-portal-backend に転送すること
// - `/admin` に対するリクエストを行ったものは `ADMINISTRATOR` であることを保証すること
export const proxy = async (request: NextRequest) => {
  const token = await getCachedToken(request.cookies);
  if (!token) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?callbackUrl=${request.nextUrl.pathname}`
    );
  }

  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    return proxyToBackend(request, token);
  }

  const pathName = request.nextUrl.pathname.toLowerCase();

  const me = await fetchUser(token);

  if (me.kind === 'unauthorized') {
    const response = NextResponse.redirect(
      `${request.nextUrl.origin}/login?callbackUrl=${request.nextUrl.pathname}`
    );
    response.cookies.set('SEICHI_PORTAL__SESSION_ID', '', {
      maxAge: 0,
      path: '/',
    });
    return response;
  }

  if (me.kind === 'error') {
    return NextResponse.redirect(`${request.nextUrl.origin}/internal-error`);
  }

  if (pathName.startsWith('/admin') && me.user.role !== 'ADMINISTRATOR') {
    return NextResponse.redirect(`${request.nextUrl.origin}/forbidden`);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/api/proxy/:path*', '/admin/:path*', '/forms/:path*'],
};
