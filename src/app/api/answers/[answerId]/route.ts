'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/user-token/mcToken';
import { updateAnswerSchema } from '../../_schemas/RequestSchemas';
import { redirectByResponse } from '../../util/responseOrErrorResponse';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/answers/${params.answerId}`,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const requestBody = updateAnswerSchema.safeParse(await req.json());
  if (!requestBody.success) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/answers/${params.answerId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody.data),
      cache: 'no-cache',
    }
  );

  if (response.ok) {
    return NextResponse.json({ status: response.status });
  } else {
    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  }
}
