'use server';

import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { NextRequest, NextResponse } from 'next/server';
import { redirectByResponse } from '../util/responseOrErrorResponse';

export async function GET(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const searchParms = req.nextUrl.searchParams;
  const formId = searchParms.get('formId');
  if (!formId) {
    return NextResponse.redirect('/badrequest');
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/${formId}/questions`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  redirectByResponse(response);

  return NextResponse.json(await response.json());
}
