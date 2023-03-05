import { mapErrForResult, mapForResult, Result } from 'option-t/PlainResult';

// NOTE: option-tで利用されている内製の型をここで作成
// https://github.com/option-t/option-t/blob/main/packages/option-t/src/internal/Function.ts#L1
type TransformFn<in T, out U> = (input: T) => U;

/**
 * Result<T, E>に対して、Ok(T)のときにwhenOk(TransformFn<T, U>)、Err(E)のときにwhenErr(TransformFn<E, F>)の関数をそれぞれ適用したResult<U, F>を返す。
 */
export const matchForResult = <T, U, E, F>(
  result: Result<T, E>,
  whenOk: TransformFn<T, U>,
  whenErr: TransformFn<E, F>,
) => mapErrForResult(mapForResult(result, whenOk), whenErr);
