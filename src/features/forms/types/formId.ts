import { assertNaturalNumber, MultiBrand, ZeroOrNaturalNumber } from '@/types';

export type FormId = MultiBrand<ZeroOrNaturalNumber, { id: 'FormId' }>;

function assertFormId(v: unknown): asserts v is FormId {
  assertNaturalNumber(v);
}

export const asFormId = (v: unknown): FormId => {
  assertFormId(v);

  return v;
};
