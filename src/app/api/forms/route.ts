import { NextRequest, NextResponse } from 'next/server';
import { redirectByResponse } from '../util/responseOrErrorResponse';

//TODO: 環境変数を使いたい
const apiServerUrl = 'http://localhost:9000';

export async function GET(_: NextRequest) {
  //TODO: tokenを取ってこれるapi定義をする(redirectとかもそこでやってほしい)
  const token = 'debug_user';
  console.log('get');

  const response = await fetch(`${apiServerUrl}/forms`, {
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
