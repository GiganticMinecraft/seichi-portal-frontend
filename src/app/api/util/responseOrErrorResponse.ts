import { NextResponse } from 'next/server';

export function redirectByResponse(response: Response) {
  if (response.ok) {
    return NextResponse.next();
  } else if (response.status == 401) {
    return NextResponse.redirect('/login');
  } else if (response.status == 403) {
    return NextResponse.redirect('/forbidden');
  } else if (response.status == 500) {
    return NextResponse.redirect('/internal-error');
  } else {
    return NextResponse.redirect('/unknown-error');
  }
}
