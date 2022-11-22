import { Nominal } from './nominal';
import {
  assertZeroOrNaturalNumber,
  isZeroOrNaturalNumber,
} from './zeroOrNaturalNumber';

export type NaturalNumber = Nominal<number, 'NaturalNumber'>;

const isNaturalNumber = (v: unknown): v is number =>
  isZeroOrNaturalNumber(v) && v !== 0;

export function assertNaturalNumber(v: unknown): asserts v is NaturalNumber {
  assertZeroOrNaturalNumber(v);

  if (!isNaturalNumber(v)) throw new Error('The value must be greater than 0');
}
