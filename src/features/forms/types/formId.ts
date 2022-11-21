import { assertNaturalNumber, Nominal, ZeroOrNaturalNumber } from '@/types';

export type FormId = Nominal<ZeroOrNaturalNumber, 'FormId'>;

function assertFormId(v: unknown): asserts v is FormId {
  assertNaturalNumber(v);
}

export const asFormId = (v: unknown): FormId => {
  assertFormId(v);

  return v;
};
