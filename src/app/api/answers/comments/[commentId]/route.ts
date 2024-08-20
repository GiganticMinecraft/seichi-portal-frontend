import { NextResponse } from 'next/server';
import { nextResponseFromResponseHeaders } from '@/app/api/_generics/responseHeaders';
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

  if (response.ok) {
    return nextResponseFromResponseHeaders(
      NextResponse.json({ status: response.status }),
      response
    );
  } else {
    return nextResponseFromResponseHeaders(
      NextResponse.json(await response.json(), { status: response.status }),
      response
    );
  }
}
