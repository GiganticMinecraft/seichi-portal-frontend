import { left, right } from 'fp-ts/lib/Either';
import type { Either } from 'fp-ts/lib/Either';

export type ErrorResponse =
  | 'Unauhorization'
  | 'Forbidden'
  | 'InternalError'
  | 'UnknownError';

export async function responseJsonOrErrorResponse<T>(
  response: Response
): Promise<Either<ErrorResponse, T>> {
  if (response.ok) {
    return right((await response.json()) as T);
  } else if (response.status == 401) {
    return left('Unauhorization');
  } else if (response.status == 403) {
    return left('Forbidden');
  } else if (response.status == 500) {
    return left('InternalError');
  } else {
    return left('UnknownError');
  }
}
