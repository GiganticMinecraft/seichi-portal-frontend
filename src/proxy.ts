import { NextResponse, type NextRequest } from 'next/server';

import {
  getPostLoginRedirectFromRequest,
  setPostLoginRedirectCookie,
} from '@/lib/postLoginRedirect';

import { getBackendServerUrl } from './env.server';
import { getCachedToken } from './user-token/mcToken';

// 未ログインでも到達してよい公開ページ。回答ページ /forms/{id} のみ
// （/forms 一覧や /forms/{id}/answers は対象外）。
const isPublicPage = (pathname: string) => /^\/forms\/[^/]+$/.test(pathname);

// 未ログインでも backend へ通してよい API（匿名回答まわり）。
const isAnonymousAllowedApi = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  if (
    request.method === 'POST' &&
    /^\/api\/proxy\/api\/v1\/forms\/[^/]+\/temporary-answers$/.test(pathname)
  ) {
    return true;
  }

  if (
    request.method === 'GET' &&
    /^\/api\/proxy\/api\/v1\/forms(\/[^/]+)?$/.test(pathname)
  ) {
    return true;
  }

  return false;
};

const proxyToBackend = (request: NextRequest, token: string | null) => {
  const backendServerUrl = getBackendServerUrl();
  const nextResponse = NextResponse.rewrite(
    `${backendServerUrl}${request.nextUrl.pathname.replace(
      '/api/proxy',
      ''
    )}${request.nextUrl.search}`
  );

  if (token) {
    nextResponse.headers.set('Authorization', `Bearer ${token}`);
  }

  return nextResponse;
};

const continueWithCurrentPath = (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    'x-current-path',
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

const redirectToLogin = (request: NextRequest) => {
  const response = NextResponse.redirect(`${request.nextUrl.origin}/`);
  setPostLoginRedirectCookie(
    response,
    getPostLoginRedirectFromRequest(request)
  );

  return response;
};

export const proxy = async (request: NextRequest) => {
  const isApi = request.nextUrl.pathname.startsWith('/api/proxy');
  const token = await getCachedToken(request.cookies);

  if (!token) {
    if (isApi) {
      // 匿名許可エンドポイントのみトークン無しで通す。それ以外は 401 相当でログインへ。
      return isAnonymousAllowedApi(request)
        ? proxyToBackend(request, null)
        : redirectToLogin(request);
    }

    // 公開ページは未ログインでも表示。保護ページは layout 側の requireUser に委ねる
    // ため、ここでログインへ誘導する（x-current-path で復帰先を渡す）。
    return isPublicPage(request.nextUrl.pathname)
      ? continueWithCurrentPath(request)
      : redirectToLogin(request);
  }

  if (isApi) {
    return proxyToBackend(request, token);
  }

  return continueWithCurrentPath(request);
};

export const config = {
  matcher: [
    '/api/proxy/:path*',
    '/admin/:path*',
    '/forms/:path*',
    '/users/:path*',
  ],
};
