import { assertNumber, isNumber } from './assertNumber';
import { Nominal } from './nominal';

export type NaturalNumber = Nominal<number, 'NaturalNumber'>;

const isNaturalNumber = (v: unknown): v is number => isNumber(v) && v > 0;

export function assertNaturalNumber(v: unknown): asserts v is NaturalNumber {
  assertNumber(v);

  if (!isNaturalNumber(v)) throw new Error('The value must be greater than 0');
}
