import {
  assertZeroOrNaturalNumber,
  isZeroOrNaturalNumber,
  MultiBrand,
  ZeroOrNaturalNumber,
} from '@/types';

export type FormId = MultiBrand<ZeroOrNaturalNumber, { id: 'FormId' }>;

export const isFormId = (v: unknown): v is FormId => isZeroOrNaturalNumber(v);

export function assertFormId(v: unknown): asserts v is FormId {
  assertZeroOrNaturalNumber(v, 'FormId');
}

export const asFormId = (v: unknown): FormId => {
  const num = Number(v);
  assertFormId(num);

  return num;
};
