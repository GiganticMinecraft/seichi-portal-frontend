'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { redirectByResponse } from '../util/responseOrErrorResponse';
import type { NextRequest } from 'next/server';

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

  redirectByResponse(req, response);

  return NextResponse.json(await response.json());
}

export async function POST(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const addQuestionsResponse = await fetch(
    `${BACKEND_SERVER_URL}/forms/questions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(await req.json()),
      cache: 'no-cache',
    }
  );

  redirectByResponse(req, addQuestionsResponse);

  return NextResponse.json(await addQuestionsResponse.json());
}
