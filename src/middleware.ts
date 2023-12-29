import { NextResponse } from 'next/server';
import { getCachedToken } from '@/features/user/api/mcToken';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  if (request.method !== 'GET') {
    return;
  }
  const pathName = request.nextUrl.pathname.toLowerCase();
  if (pathName === '/' || pathName.includes('_next/static')) {
    return;
  }

  if (!!await getCachedToken(request.cookies)) {
    return;
  }

  return NextResponse.redirect(new URL('/', request.url));
};
