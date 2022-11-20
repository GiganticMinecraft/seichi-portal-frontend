import { assertString, isString } from './assertString';
import { Nominal } from './nominal';

export type NonEmptyString = Nominal<string, 'NonEmptyString'>;

const isNonEmptyString = (v: unknown): v is string => isString(v) && v !== '';

export function assertNonEmptyString(
  v: unknown,
  target = '',
): asserts v is NonEmptyString {
  assertString(v);

  if (!isNonEmptyString(v))
    throw new Error(`${target} must be not empty string`.trim());
}
