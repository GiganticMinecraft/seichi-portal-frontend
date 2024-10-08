'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { removeUndefinedOrNullRecords } from '@/generic/RecordExtra';
import { getCachedToken } from '@/user-token/mcToken';
import { nextResponseFromResponseHeaders } from '../_generics/responseHeaders';
import {
  createQuestionSchema,
  updateQuestionSchema,
} from '../_schemas/RequestSchemas';
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

  return nextResponseFromResponseHeaders(
    NextResponse.json(await response.json(), { status: response.status }),
    response
  );
}

export async function POST(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const parsedCreateQuestion = createQuestionSchema.safeParse(await req.json());

  if (!parsedCreateQuestion.success) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const addQuestionsResponse = await fetch(
    `${BACKEND_SERVER_URL}/forms/questions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsedCreateQuestion.data),
      cache: 'no-cache',
    }
  );

  return nextResponseFromResponseHeaders(
    NextResponse.json(await addQuestionsResponse.json(), {
      status: addQuestionsResponse.status,
    }),
    addQuestionsResponse
  );
}

export async function PUT(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const parsedUpdateQuestion = updateQuestionSchema.safeParse(await req.json());

  if (!parsedUpdateQuestion.success) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const updateQuestionsResponse = await fetch(
    `${BACKEND_SERVER_URL}/forms/questions`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...parsedUpdateQuestion.data,
        questions: parsedUpdateQuestion.data.questions.map((question) =>
          removeUndefinedOrNullRecords(question)
        ),
      }),
      cache: 'no-cache',
    }
  );

  return nextResponseFromResponseHeaders(
    NextResponse.json(await updateQuestionsResponse.json(), {
      status: updateQuestionsResponse.status,
    }),
    updateQuestionsResponse
  );
}
