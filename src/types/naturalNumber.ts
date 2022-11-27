import { MultiBrand } from './multiBrand';
import {
  assertZeroOrNaturalNumber,
  isZeroOrNaturalNumber,
} from './zeroOrNaturalNumber';

export type NaturalNumber = MultiBrand<number, { number: 'NaturalNumber' }>;

export const isNaturalNumber = (v: unknown): v is number =>
  isZeroOrNaturalNumber(v) && v !== 0;

export function assertNaturalNumber(
  v: unknown,
  target = 'The value',
): asserts v is NaturalNumber {
  assertZeroOrNaturalNumber(v, target);

  if (!isNaturalNumber(v))
    throw new Error(`${target} must be greater than 0, but got ${v}`);
}

export const asNaturalNumber = (v: unknown, target?: string): NaturalNumber => {
  assertNaturalNumber(v, target);

  return v;
};
