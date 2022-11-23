import { assertString, isString } from './assertString';
import { MultiBrand } from './multiBrand';

export type NonEmptyString = MultiBrand<string, { string: 'NonEmptyString' }>;

const isNonEmptyString = (v: unknown): v is string => isString(v) && v !== '';

export function assertNonEmptyString(
  v: unknown,
  target = '',
): asserts v is NonEmptyString {
  assertString(v);

  if (!isNonEmptyString(v))
    throw new Error(`${target} must be not empty string`.trim());
}

export const asNonEmptyString = (v: unknown): NonEmptyString => {
  assertNonEmptyString(v);

  return v;
};
