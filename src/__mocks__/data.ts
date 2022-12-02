import {
  FormInfo,
  asFormId,
  Form,
  asQuestionId,
  Question,
  QuestionType,
} from '@/features/forms/types';
import { rangeIter } from '@/libs';
import { asNonEmptyString } from '@/types';

export const formInfoList: FormInfo[] = [
  {
    id: asFormId(0),
    title: asNonEmptyString('通報'),
    description: '通報フォームです。',
  },
  {
    id: asFormId(1),
    title: asNonEmptyString('不具合報告'),
    description: '不具合報告フォームです。',
  },
];

export const formList: Form[] = formInfoList.map((info) => {
  const questions: Question[] = [...rangeIter(0, 6)].map((index) => {
    const title = `質問${index}`;
    const chooseType = (): QuestionType => {
      if (index === 0 || index === 1) {
        return 'TEXT';
      }
      if (index === 2 || index === 3) {
        return 'PULLDOWN';
      }

      return 'CHECKBOX';
    };
    const choices = ['Choice 1', 'Choice 2'].map((str) =>
      asNonEmptyString(str),
    );

    return {
      id: asQuestionId(index),
      title: asNonEmptyString(title),
      description: `${title}です。`,
      type: chooseType(),
      choices,
    };
  });

  return {
    ...info,
    questions,
  };
});
