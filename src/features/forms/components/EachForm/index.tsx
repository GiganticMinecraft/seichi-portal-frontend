import { useRouter } from 'next/router';

import { useForm as fetchForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

export const EachForm = () => {
  const { query, isReady } = useRouter<'/forms/[id]'>();
  if (!isReady) return null;
  const form = fetchForm(asFormId(query.id));

  return form ? <Presenter {...{ form }} /> : null;
};
