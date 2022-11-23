import { assertNumber, isNumber } from './assertNumber';
import { Nominal } from './nominal';

export type ZeroOrNaturalNumber = Nominal<number, 'ZeroOrNaturalNumber'>;

export const isZeroOrNaturalNumber = (v: unknown): v is number =>
  isNumber(v) && v >= 0 && Number.isInteger(v);

export function assertZeroOrNaturalNumber(
  v: unknown,
): asserts v is ZeroOrNaturalNumber {
  assertNumber(v);

  if (!isZeroOrNaturalNumber(v))
    throw new Error('The value must be greater than or equal to 0');
}

export const asZeroOrNaturalNumber = (v: unknown): ZeroOrNaturalNumber => {
  assertZeroOrNaturalNumber(v);

  return v;
};
