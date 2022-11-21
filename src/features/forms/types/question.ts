import { NonEmptyString } from '@/types';

import { QuestionId } from './questionId';

export type QuestionType = 'text' | 'pulldown' | 'checkbox';

export type Question = {
  id: QuestionId;
  title: NonEmptyString;
  description: string;
  type: QuestionType;
  choices: NonEmptyString[];
};
