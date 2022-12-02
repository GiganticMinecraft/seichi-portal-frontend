import {
  isNonEmptyString,
  isNonEmptyStringList,
  NonEmptyString,
} from '@/types';
import { isString } from '@/types/assertString';

import { isQuestionId, QuestionId } from './questionId';

const questionTypes = ['TEXT', 'PULLDOWN', 'CHECKBOX'] as const;
export type QuestionType = typeof questionTypes[number];

const isQuestionType = (v: unknown): v is QuestionType =>
  isString(v) && !!questionTypes.find((t) => t === v);

export type Question = {
  id: QuestionId;
  title: NonEmptyString;
  description: string;
  type: QuestionType;
  choices?: NonEmptyString[];
};

export const isQuestion = (arg: unknown): arg is Question => {
  const q = arg as Question;

  return (
    isQuestionId(q?.id) &&
    isNonEmptyString(q?.title) &&
    isString(q?.description) &&
    isQuestionType(q?.type) &&
    isNonEmptyStringList(q?.choices ?? [])
  );
};

export const isQuestionList = (args: unknown[]): args is Question[] =>
  args.every((arg) => isQuestion(arg));
