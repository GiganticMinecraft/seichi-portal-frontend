import { FormInfo, asFormId } from '@/features/forms/types';
import { asNonEmptyString } from '@/types';

export const formInfoList: FormInfo[] = [
  {
    id: asFormId(1),
    title: asNonEmptyString('通報'),
    description: '通報フォームです。',
  },
  {
    id: asFormId(2),
    title: asNonEmptyString('不具合報告'),
    description: '不具合報告フォームです。',
  },
];
