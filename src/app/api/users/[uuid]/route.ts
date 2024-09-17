'use server';

import { NextResponse } from 'next/server';
import { BACKEND_SERVER_URL } from '@/env';
import { getCachedToken } from '@/user-token/mcToken';
import { nextResponseFromResponseHeaders } from '../../_generics/responseHeaders';
import { updateUserSchema } from '../../_schemas/RequestSchemas';
import type { NextRequest } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const token = await getCachedToken();
  if (!token) {
    return NextResponse.redirect('/');
  }

  const role = updateUserSchema.safeParse(await req.json());

  if (!role.success) {
    return NextResponse.json({ error: role.error.errors }, { status: 400 });
  }

  const response = await fetch(
    `${BACKEND_SERVER_URL}/users/${params.uuid}?role=${role.data.role}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  return nextResponseFromResponseHeaders(
    NextResponse.json({ status: response.status }),
    response
  );
}
