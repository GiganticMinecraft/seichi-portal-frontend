import { useRouter } from 'next/router';

import { useForm as fetchForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

export const EachForm = () => {
  const router = useRouter<'/forms/[id]'>();
  if (!router.isReady) return null;
  const form = fetchForm(asFormId(router.query.id));

  return form ? <Presenter {...{ form }} /> : null;
};
