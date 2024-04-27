'use server';

import { NextResponse } from 'next/server';
import { createFormResponseSchema } from '@/_schemas/formSchema';
import { formSchema } from '@/app/(authed)/admin/forms/create/_schema/createFormSchema';
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

  const parsed = formSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form values.' },
      { status: 400 }
    );
  }

  const form = parsed.data;

  const createFormResponse = await fetch(`${BACKEND_SERVER_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: form.title,
      description: form.description,
    }),
    cache: 'no-cache',
  });

  if (!createFormResponse.ok) {
    return NextResponse.json({}, { status: createFormResponse.status });
  }

  const parsedCreateFormResponse = createFormResponseSchema.safeParse(
    await createFormResponse.json()
  );

  if (!parsedCreateFormResponse.success) {
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }

  const queryRecord = {
    form_id: parsedCreateFormResponse.data.id,
    visibility: form.settings.visibility,
    start_at: form.settings.response_period?.start_at,
    end_at: form.settings.response_period?.end_at,
    default_answer_title: form.settings.default_answer_title,
    webhook: form.settings.webhook_url,
  };

  const cleanedQueryRecord = Object.fromEntries(
    Object.entries(queryRecord).filter(
      ([_key, value]) => value != null && value !== undefined
    )
  ) as {
    [k: string]: string;
  };

  const patchQuery = new URLSearchParams(cleanedQueryRecord).toString();

  const patchFormResponse = await fetch(
    `${req.nextUrl.origin}/api/form?${patchQuery}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  return NextResponse.json({}, { status: patchFormResponse.status });
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
