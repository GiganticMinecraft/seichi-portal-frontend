'use server';

import { NextResponse } from 'next/server';
import { nextResponseFromResponseHeaders } from '@/app/api/_generics/responseHeaders';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/user-token/mcToken';
import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { formId: string } }
) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/${params.formId}/answers`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  return nextResponseFromResponseHeaders(
    NextResponse.json(await response.json(), { status: response.status }),
    response
  );
}
