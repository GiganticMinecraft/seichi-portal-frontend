import { BACKEND_SERVER_URL } from '@/env';
import { NextRequest, NextResponse } from 'next/server';

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
    const nextResponse = NextResponse.json({ status: response.status });
    response.headers.forEach((value, key) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  } else {
    return NextResponse.json(await response.json(), {
      status: response.status,
    });
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
    const nextResponse = NextResponse.json({ status: response.status });
    response.headers.forEach((value, key) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  } else {
    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  }
}
