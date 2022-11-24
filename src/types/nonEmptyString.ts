import { assertString, isString } from './assertString';
import { MultiBrand } from './multiBrand';

export type NonEmptyString = MultiBrand<string, { string: 'NonEmptyString' }>;

export const isNonEmptyString = (v: unknown): v is string =>
  isString(v) && v !== '';

export function assertNonEmptyString(
  v: unknown,
  target = 'The value',
): asserts v is NonEmptyString {
  assertString(v, target);

  if (!isNonEmptyString(v))
    throw new Error(`${target} must be not empty string`.trim());
}

export const asNonEmptyString = (
  v: unknown,
  target?: string,
): NonEmptyString => {
  assertNonEmptyString(v, target);

  return v;
};
