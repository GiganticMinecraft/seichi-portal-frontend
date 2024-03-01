import { ErrorResponse } from '@/features/form/api/form';
import { Either, isLeft } from 'fp-ts/lib/Either';
import { match } from 'ts-pattern';

const getErrorReason = (errorResponse: ErrorResponse) => {
  return match(errorResponse)
    .with('Unauhorization', () => '認証されていません')
    .with('Forbidden', () => '権限が足りません')
    .with('InternalError', () => 'サーバーエラーが発生しました')
    .with('UnknownError', () => '不明なエラーが発生しました')
    .exhaustive();
};

export function noticeError<T>(errorResponseOrT: Either<ErrorResponse, T>) {
  if (isLeft(errorResponseOrT)) {
    const errorReason = getErrorReason(errorResponseOrT.left);
    alert(`エラーが発生しました: ${errorReason}`);
  }
}
