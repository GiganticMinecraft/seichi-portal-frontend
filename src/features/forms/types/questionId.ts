import {
  assertZeroOrNaturalNumber,
  isZeroOrNaturalNumber,
  MultiBrand,
  ZeroOrNaturalNumber,
} from '@/types';

export type QuestionId = MultiBrand<ZeroOrNaturalNumber, { id: 'QuestionId' }>;

export const isQuestionId = (v: unknown): v is QuestionId =>
  isZeroOrNaturalNumber(v);

function assertQuestionId(v: unknown): asserts v is QuestionId {
  assertZeroOrNaturalNumber(v, 'QuestionId');
}

export const asQuestionId = (v: unknown): QuestionId => {
  const num = Number(v);
  assertQuestionId(num);

  return num;
};
