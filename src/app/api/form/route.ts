'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/user-token/mcToken';
import { nextResponseFromResponseHeaders } from '../_generics/responseHeaders';
import { createFormSchema, updateFormSchema } from '../_schemas/RequestSchemas';
import {
  createFormResponseSchema,
  getFormResponseSchema,
} from '../_schemas/ResponseSchemas';
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

  const parsed = getFormResponseSchema.safeParse(await response.json());

  if (!parsed.success) {
    console.error('Failed to parse get form response schema.');
    return nextResponseFromResponseHeaders(
      NextResponse.json(
        { error: 'Failed to parse get form response schema.' },
        { status: 500 }
      ),
      response
    );
  }

  return nextResponseFromResponseHeaders(
    NextResponse.json(parsed.data, { status: 200 }),
    response
  );
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
      return nextResponseFromResponseHeaders(
        NextResponse.json(parsed.data, {
          status: 201,
        }),
        createFormResponse
      );
    } else {
      return nextResponseFromResponseHeaders(
        NextResponse.json(
          {
            error:
              'Failed to parse from request body to create form schema. Frontend schema is different from backend schema.',
          },
          { status: 500 }
        ),
        createFormResponse
      );
    }
  } else {
    return nextResponseFromResponseHeaders(
      NextResponse.json(
        { error: 'Failed to parse from request body to create form schema.' },
        { status: 400 }
      ),
      createFormResponse
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

  const parsedUpdateFormSchema = updateFormSchema.safeParse(await req.json());

  if (!parsedUpdateFormSchema.success) {
    return NextResponse.json(
      { error: 'Failed to parse from request body to update form schema.' },
      { status: 400 }
    );
  }

  const response = await fetch(`${BACKEND_SERVER_URL}/forms/${formId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsedUpdateFormSchema.data),
    cache: 'no-cache',
  });

  return nextResponseFromResponseHeaders(
    NextResponse.json(await response.json(), { status: response.status }),
    response
  );
}
