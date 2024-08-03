import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/user-token/mcToken';
import type { NextRequest } from 'next/server';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { commentId: number } }
) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/forms/answers/comments/${params.commentId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  console.log(response.status);

  if (response.ok) {
    return NextResponse.json({ status: response.status });
  } else {
    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  }
}
