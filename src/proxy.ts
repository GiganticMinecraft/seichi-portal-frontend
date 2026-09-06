import { context, propagation } from '@opentelemetry/api';
import { NextResponse, type NextRequest } from 'next/server';

import {
  getPostLoginRedirectFromRequest,
  setPostLoginRedirectCookie,
} from '@/lib/postLoginRedirect';

import {
  getBackendServerUrl,
  getMsalOrigin,
  getSeichiProxyHeaders,
} from './env.server';
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

export const buildBackendRequestHeaders = (
  incomingHeaders: HeadersInit,
  token: string | null
) => {
  // Authorization はリクエストヘッダとして注入する。レスポンスヘッダ経由の
  // 注入は undocumented な挙動依存であり、Bearer トークンがブラウザへの
  // レスポンスにもエコーされてしまう。
  const headers = new Headers(incomingHeaders);
  // These values are server-to-backend credentials. Never forward values
  // supplied by the browser, even when the secret is not configured.
  headers.delete('x-seichi-proxy-secret');
  headers.delete('x-seichi-client-ip');
  for (const [name, value] of Object.entries(
    getSeichiProxyHeaders(new Headers(incomingHeaders))
  )) {
    headers.set(name, value);
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const proxyToBackend = (request: NextRequest, token: string | null) => {
  const backendServerUrl = getBackendServerUrl();
  const headers = buildBackendRequestHeaders(request.headers, token);

  // rewrite による backend への外部 hop は Next がスパン化しないため、active な
  // trace context を手動で注入してトレースを繋ぐ。active span が無い場合は
  // no-op で、ブラウザ由来の traceparent がそのまま backend へ届く。
  propagation.inject(context.active(), headers, {
    set: (carrier, key, value) => {
      carrier.set(key, value);
    },
  });

  return NextResponse.rewrite(
    `${backendServerUrl}${request.nextUrl.pathname.replace(
      '/api/proxy',
      ''
    )}${request.nextUrl.search}`,
    { request: { headers } }
  );
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
  const response = NextResponse.redirect(`${getMsalOrigin()}/`);
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
      // 匿名許可エンドポイントのみトークン無しで通す。それ以外は 401 を返す。
      // API リクエストは画面遷移ではないため、ログイン画面へリダイレクトしたり
      // このパス自体をログイン後の復帰先として保存したりしない。
      return isAnonymousAllowedApi(request)
        ? proxyToBackend(request, null)
        : new NextResponse(null, { status: 401 });
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
