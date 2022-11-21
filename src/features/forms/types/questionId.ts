import { assertNaturalNumber, Nominal, ZeroOrNaturalNumber } from '@/types';

export type QuestionId = Nominal<ZeroOrNaturalNumber, 'QuestionId'>;

function assertQuestionId(v: unknown): asserts v is QuestionId {
  assertNaturalNumber(v);
}

export const asQuestionId = (v: unknown): QuestionId => {
  assertQuestionId(v);

  return v;
};
