import { NextResponse, type NextRequest } from 'next/server';
import { getBackendServerUrl } from './env.server';
import { getCachedToken } from './user-token/mcToken';
import {
  getPostLoginRedirectFromRequest,
  setPostLoginRedirectCookie,
} from '@/lib/postLoginRedirect';

const proxyToBackend = (request: NextRequest, token: string) => {
  const backendServerUrl = getBackendServerUrl();
  const nextResponse = NextResponse.rewrite(
    `${backendServerUrl}${request.nextUrl.pathname.replace(
      '/api/proxy',
      ''
    )}${request.nextUrl.search}`
  );

  nextResponse.headers.set('Authorization', `Bearer ${token}`);

  return nextResponse;
};

export const proxy = async (request: NextRequest) => {
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const token = await getCachedToken(request.cookies);
  if (!token) {
    const response = NextResponse.redirect(`${request.nextUrl.origin}/`);
    setPostLoginRedirectCookie(
      response,
      getPostLoginRedirectFromRequest(request)
    );
    return response;
  }

  if (request.nextUrl.pathname.startsWith('/api/proxy')) {
    return proxyToBackend(request, token);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-current-path', currentPath);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: [
    '/api/proxy/:path*',
    '/admin/:path*',
    '/forms/:path*',
    '/users/:path*',
  ],
};
