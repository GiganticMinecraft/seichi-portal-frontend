import { assertNaturalNumber, MultiBrand, ZeroOrNaturalNumber } from '@/types';

export type QuestionId = MultiBrand<ZeroOrNaturalNumber, { id: 'QuestionId' }>;

function assertQuestionId(v: unknown): asserts v is QuestionId {
  assertNaturalNumber(v, 'QuestionId');
}

export const asQuestionId = (v: unknown): QuestionId => {
  assertQuestionId(v);

  return v;
};
