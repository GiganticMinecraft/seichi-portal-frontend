import type { NextResponse } from 'next/server';

export function nextResponseFromResponseHeaders(
  nextResponse: NextResponse,
  fetchResponse: Response
): NextResponse {
  fetchResponse.headers.forEach((value, key) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
}
