'use server';

import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { NextRequest, NextResponse } from 'next/server';
import { redirectByResponse } from '../util/responseOrErrorResponse';

export async function GET(_: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const response = await fetch(`${BACKEND_SERVER_URL}/forms/answers`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  redirectByResponse(response);

  return NextResponse.json(await response.json());
}
