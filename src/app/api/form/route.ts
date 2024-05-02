'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { removeUndefinedOrNullRecords } from '@/generic/RecordExtra';
import { createFormSchema } from '../_schemas/RequestSchemas';
import { createFormResponseSchema } from '../_schemas/ResponseSchemas';
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

  const parsedCreateFormSchema = createFormSchema.safeParse(await req.json());

  if (!parsedCreateFormSchema.success) {
    return NextResponse.json(
      { error: 'Failed to parse from request body to create form schema.' },
      { status: 400 }
    );
  }

  const createFormResponse = await fetch(`${BACKEND_SERVER_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsedCreateFormSchema.data),
    cache: 'no-cache',
  });

  if (createFormResponse.ok) {
    const parsed = createFormResponseSchema.safeParse(
      await createFormResponse.json()
    );
    if (parsed.success) {
      return NextResponse.json(parsed.data, {
        status: 201,
      });
    } else {
      return NextResponse.json(
        {
          error:
            'Failed to parse from request body to create form schema. Frontend schema is different from backend schema.',
        },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: 'Failed to parse from request body to create form schema.' },
      { status: 400 }
    );
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

  const start_at = searchParams.get('start_at');
  const end_at = searchParams.get('end_at');

  const patchQuery = new URLSearchParams(
    removeUndefinedOrNullRecords({
      start_at: start_at ? `${start_at}:00+09:00` : undefined,
      end_at: end_at ? `${end_at}:00+09:00` : undefined,
      visibility: searchParams.get('visibility'),
      default_answer_title: searchParams.get('default_answer_title'),
      webhook: searchParams.get('webhook_url'),
    })
  ).toString();

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
