import { isNonEmptyString, NonEmptyString } from '@/types';
import { isString } from '@/types/assertString';

import { FormId, isFormId } from './formId';
import { isQuestionList, Question } from './question';

export type Form = {
  id: FormId;
  title: NonEmptyString;
  description: string;
  questions: Question[];
};

// TODO: 散らばったtype guardsのテスト
export const isForm = (arg: unknown): arg is Form => {
  const f = arg as Form;

  return (
    isFormId(f?.id) &&
    isNonEmptyString(f?.title) &&
    isString(f?.description) &&
    isQuestionList(f?.questions)
  );
};
