import { isLeft } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import { match } from 'ts-pattern';
import type { ErrorResponse } from '@/features/form/api/form';
import type { Either } from 'fp-ts/lib/Either';

export function redirectOrDoNothing<T>(
  errorResponseOrT: Either<ErrorResponse, T>
) {
  if (isLeft(errorResponseOrT)) {
    match(errorResponseOrT.left)
      .with('Unauhorization', () => redirect('/'))
      .with('Forbidden', () => redirect('/forbidden'))
      .with('InternalError', () => redirect('/internal-error'))
      .with('UnknownError', () => redirect('/unknown-error'))
      .exhaustive();
  }
}
