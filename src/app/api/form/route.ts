'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { redirectByResponse } from '../util/responseOrErrorResponse';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  const searchParms = req.nextUrl.searchParams;
  const formId = searchParms.get('formId');

  const response = await fetch(`${BACKEND_SERVER_URL}/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  redirectByResponse(req, response);

  return NextResponse.json(await response.json());
}

export async function POST(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const response = await fetch(`${BACKEND_SERVER_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(await req.json()),
    cache: 'no-cache',
  });

  if (response.ok) {
    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } else {
    return NextResponse.json({}, { status: response.status });
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const searchParams = req.nextUrl.searchParams;
  const formId = searchParams.get('form_id');

  if (!formId) {
    return NextResponse.json({}, { status: 400 });
  }
  const patchQuery = new URLSearchParams({
    start_at: `${searchParams.get('start_at')}:00+09:00` || '',
    end_at: `${searchParams.get('end_at')}:00+09:00` || '',
    visibility: searchParams.get('visibility') || '',
  }).toString();

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/${formId}?${patchQuery}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  return NextResponse.json(await response.json());
}
