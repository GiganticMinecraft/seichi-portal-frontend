import {
  mapErrForResult,
  mapForResult,
  Result,
} from 'option-t/lib/PlainResult';
import { TransformFn } from 'option-t/lib/internal/Function';

/**
 * Result<T, E>に対して、Ok(T)のときにwhenOk(TransformFn<T, U>)、Err(E)のときにwhenErr(TransformFn<E, F>)の関数をそれぞれ適用したResult<U, F>を返す。
 */
export const matchForResult = <T, U, E, F>(
  result: Result<T, E>,
  whenOk: TransformFn<T, U>,
  whenErr: TransformFn<E, F>,
) => mapErrForResult(mapForResult(result, whenOk), whenErr);
