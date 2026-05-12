import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getBackendServerUrl } from '@/env.server';
import { userInfoResponseSchema } from '@/lib/api/schemas';
import { getCachedToken } from '@/user-token/mcToken';
import type { NextRequest } from 'next/server';

const sessionResponseSchema = z.object({
  user: userInfoResponseSchema,
});

export async function GET(request: NextRequest) {
  const token = await getCachedToken(request.cookies);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${getBackendServerUrl()}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    });

    if (response.status === 401) {
      const nextResponse = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
      nextResponse.cookies.set('SEICHI_PORTAL__SESSION_ID', '', {
        maxAge: 0,
        path: '/',
      });
      return nextResponse;
    }

    if (!response.ok) {
      console.error(
        'Failed to fetch session user from backend:',
        response.status
      );
      return NextResponse.json(
        { error: 'Failed to fetch session user' },
        { status: 502 }
      );
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = sessionResponseSchema.safeParse({ user: body });

    if (!parsed.success) {
      console.error('Failed to parse session user response from backend');
      return NextResponse.json(
        { error: 'Invalid session user response' },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error('Failed to fetch session user from backend:', error);
    return NextResponse.json(
      { error: 'Unexpected session lookup error' },
      { status: 500 }
    );
  }
}
