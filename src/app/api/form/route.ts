'use server';

import { NextResponse } from 'next/server';
import { createFormResponseSchema } from '@/_schemas/formSchema';
import { formSchema } from '@/app/(authed)/admin/forms/create/_schema/createFormSchema';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { removeUndefinedOrNullRecords } from '@/generic/RecordExtra';
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

  const cleanedQueryRecord = removeUndefinedOrNullRecords(queryRecord);

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
