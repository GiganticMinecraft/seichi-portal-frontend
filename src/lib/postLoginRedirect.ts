import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { normalizeRedirectTarget } from './redirect';
import type { NextRequest } from 'next/server';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

const POST_LOGIN_REDIRECT_COOKIE = 'SEICHI_PORTAL__POST_LOGIN_REDIRECT';
const POST_LOGIN_REDIRECT_MAX_AGE = 60 * 10;

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});

export const normalizePostLoginRedirect = normalizeRedirectTarget;

export const getPostLoginRedirectFromRequest = (request: NextRequest) =>
  normalizePostLoginRedirect(
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

export const setPostLoginRedirectCookie = (
  response: NextResponse,
  redirectTo: string
) => {
  response.cookies.set(
    POST_LOGIN_REDIRECT_COOKIE,
    normalizePostLoginRedirect(redirectTo),
    {
      ...getCookieOptions(),
      maxAge: POST_LOGIN_REDIRECT_MAX_AGE,
    }
  );
};

export const clearPostLoginRedirectCookie = (response: NextResponse) => {
  response.cookies.set(POST_LOGIN_REDIRECT_COOKIE, '', {
    ...getCookieOptions(),
    maxAge: 0,
  });
};

export const getPostLoginRedirectCookie = async (cookie?: RequestCookies) => {
  const cookieStore = cookie ?? (await cookies());
  return normalizePostLoginRedirect(
    cookieStore.get(POST_LOGIN_REDIRECT_COOKIE)?.value
  );
};
