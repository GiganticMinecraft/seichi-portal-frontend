import { NextRequest, NextResponse } from 'next/server';
import { redirectByResponse } from '../util/responseOrErrorResponse';
import { BACKEND_SERVER_URL } from '@/env';

export async function GET(_: NextRequest) {
  //TODO: tokenを取ってこれるapi定義をする(redirectとかもそこでやってほしい)
  const token = 'debug_user';

  const response = await fetch(`${BACKEND_SERVER_URL}/forms`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  redirectByResponse(response);

  return NextResponse.json(await response.json());
}
