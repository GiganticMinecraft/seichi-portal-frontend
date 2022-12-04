import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { useForm as fetchForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

export const EachForm = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { query } = useRouter();
  const form = fetchForm(asFormId(query.id));
  if (!form) return null;
  const onSubmit = handleSubmit(async (data) => {
    // TODO: impl
    alert(JSON.stringify(data, null, 2));
    reset();
  });

  return <Presenter {...{ form, register, onSubmit, isSubmitting }} />;
};
