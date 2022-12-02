import { Options } from 'ky';

import { ky } from '@/libs/ky';

import { BACKEND_API_OPTIONS } from './config';

import { FormId, isForm } from '../types';

export const getForm = async (formId: FormId, options?: Options) => {
  const mergedOptions = {
    ...BACKEND_API_OPTIONS,
    ...options,
  };
  const resp = await ky.get(`forms/${formId.toString()}`, mergedOptions);
  const form = await resp.json();

  if (!isForm(form)) {
    throw new Error('API type error');
  }

  return form;
};
