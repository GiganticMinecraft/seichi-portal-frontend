import { NonEmptyString } from '@/types';

import { FormId } from './formId';
import { Question } from './question';

export type Form = {
  id: FormId;
  title: NonEmptyString;
  description: string;
  questions: Question[];
};
