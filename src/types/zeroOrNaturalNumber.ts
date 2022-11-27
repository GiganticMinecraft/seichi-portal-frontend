import { assertNumber, isNumber } from './assertNumber';
import { MultiBrand } from './multiBrand';

export type ZeroOrNaturalNumber = MultiBrand<
  number,
  { number: 'ZeroOrNaturalNumber' }
>;

export const isZeroOrNaturalNumber = (v: unknown): v is number =>
  isNumber(v) && v >= 0 && Number.isInteger(v);

export function assertZeroOrNaturalNumber(
  v: unknown,
  target = 'The value',
): asserts v is ZeroOrNaturalNumber {
  assertNumber(v, target);

  if (!isZeroOrNaturalNumber(v))
    throw new Error(
      `${target} must be greater than or equal to 0, but got ${v}`.trim(),
    );
}

export const asZeroOrNaturalNumber = (
  v: unknown,
  target?: string,
): ZeroOrNaturalNumber => {
  assertZeroOrNaturalNumber(v, target);

  return v;
};
