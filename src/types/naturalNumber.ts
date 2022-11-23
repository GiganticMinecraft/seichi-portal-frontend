import { MultiBrand } from './multiBrand';
import {
  assertZeroOrNaturalNumber,
  isZeroOrNaturalNumber,
} from './zeroOrNaturalNumber';

export type NaturalNumber = MultiBrand<number, { number: 'NaturalNumber' }>;

const isNaturalNumber = (v: unknown): v is number =>
  isZeroOrNaturalNumber(v) && v !== 0;

export function assertNaturalNumber(v: unknown): asserts v is NaturalNumber {
  assertZeroOrNaturalNumber(v);

  if (!isNaturalNumber(v)) throw new Error('The value must be greater than 0');
}

export const asNaturalNumber = (v: unknown): NaturalNumber => {
  assertNaturalNumber(v);

  return v;
};
