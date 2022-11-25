import {
  FormInfo,
  asFormId,
  Form,
  asQuestionId,
  Question,
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
  const questions: Question[] = [...rangeIter(0, 5)].map((index) => {
    const title = `質問${index}`;

    return {
      id: asQuestionId(index),
      title: asNonEmptyString(title),
      description: `${title}です。`,
      type: 'text',
    };
  });

  return {
    ...info,
    questions,
  };
});
