import { NextResponse } from 'next/server';

import {
  clearPostLoginRedirectCookie,
  getPostLoginRedirectCookie,
} from '@/lib/postLoginRedirect';

export async function POST() {
  const redirectTo = await getPostLoginRedirectCookie();
  const response = NextResponse.json({ redirectTo });

  clearPostLoginRedirectCookie(response);

  return response;
}
