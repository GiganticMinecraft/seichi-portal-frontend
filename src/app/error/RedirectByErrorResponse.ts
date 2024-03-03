import { ErrorResponse } from '@/features/form/api/form';
import { Either, isLeft } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import { match } from 'ts-pattern';

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
