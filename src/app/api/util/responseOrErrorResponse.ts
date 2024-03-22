import { NextRequest, NextResponse } from 'next/server';

export function redirectByResponse(reqest: NextRequest, response: Response) {
  if (response.ok) {
    return NextResponse.next();
  } else if (response.status == 401) {
    return NextResponse.redirect(`${reqest.nextUrl.origin}/login`);
  } else if (response.status == 403) {
    return NextResponse.redirect(`${reqest.nextUrl.origin}/forbidden`);
  } else if (response.status == 500) {
    return NextResponse.redirect(`${reqest.nextUrl.origin}/internal-error`);
  } else {
    return NextResponse.redirect(`${reqest.nextUrl.origin}/unknown-error`);
  }
}
