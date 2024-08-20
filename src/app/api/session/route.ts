import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { nextResponseFromResponseHeaders } from '../_generics/responseHeaders';
import type { NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader) {
    return NextResponse.redirect('/login');
  }

  const response = await fetch(`${BACKEND_SERVER_URL}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorizationHeader,
    },
    cache: 'no-cache',
  });

  if (response.ok) {
    return nextResponseFromResponseHeaders(
      NextResponse.json({ status: response.status }),
      response
    );
  } else {
    return nextResponseFromResponseHeaders(
      NextResponse.json(await response.json(), {
        status: response.status,
      }),
      response
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader) {
    return NextResponse.redirect('/login');
  }

  const response = await fetch(`${BACKEND_SERVER_URL}/session`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorizationHeader,
    },
    cache: 'no-cache',
  });

  if (response.ok) {
    return nextResponseFromResponseHeaders(
      NextResponse.json({ status: response.status }),
      response
    );
  } else {
    return nextResponseFromResponseHeaders(
      NextResponse.json(await response.json(), {
        status: response.status,
      }),
      response
    );
  }
}
