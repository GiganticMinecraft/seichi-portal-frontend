'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/features/user/api/mcToken';
import { removeUndefinedOrNullRecords } from '@/generic/RecordExtra';
import { createQuestionSchema } from '../_schemas/RequestSchemas';
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

  redirectByResponse(req, addQuestionsResponse);

  return NextResponse.json(await addQuestionsResponse.json());
}

export async function PUT(req: NextRequest) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const parsedUpdateQuestion = createQuestionSchema.safeParse(await req.json());

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

  redirectByResponse(req, updateQuestionsResponse);

  return NextResponse.json(await updateQuestionsResponse.json());
}
