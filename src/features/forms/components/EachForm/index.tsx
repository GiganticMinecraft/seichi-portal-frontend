import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useForm as fetchForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

export const EachForm = () => {
  const methods = useForm();
  const onSubmit = methods.handleSubmit(async (data) => {
    // TODO: impl
    alert(JSON.stringify(data, null, 2));
    methods.reset();
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();
  const form = fetchForm(asFormId(router.query.id));
  if (!form) return null;

  return (
    <Presenter
      {...{ form, methods, onSubmit, isConfirming, setIsConfirming }}
    />
  );
};
