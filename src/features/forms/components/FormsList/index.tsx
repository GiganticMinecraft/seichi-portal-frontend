import { useRouter } from 'next/router';

import { asNonEmptyString } from '@/types';

import { Presenter } from './presenter';

import { asFormId, FormInfo } from '../../types';

const dummy: FormInfo[] = [
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

export const FormsList = () => {
  const router = useRouter();

  return (
    <Presenter forms={dummy} onClick={(id) => router.push(`/forms/${id}`)} />
  );
};
