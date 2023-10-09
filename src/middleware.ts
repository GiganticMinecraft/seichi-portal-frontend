import { NextResponse } from 'next/server';
import { getCachedToken } from './api/mcToken';
import type { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  if (request.method !== 'GET') {
    return;
  }
  const pathName = request.nextUrl.pathname.toLowerCase();
  if (pathName === '/' || pathName.includes('_next/static')) {
    return;
  }

  if (!!getCachedToken(request.cookies)) {
    return;
  }

  return NextResponse.redirect(new URL('/', request.url));
};
