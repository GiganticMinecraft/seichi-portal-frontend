import { Options } from 'ky';

import { ky } from '@/libs/ky';

import { BACKEND_API_OPTIONS } from './config';

import { isFormInfoList } from '../types';

export const getFormInfoList = async (options?: Options) => {
  const mergedOptions = {
    ...BACKEND_API_OPTIONS,
    ...options,
  };
  const resp = await ky.get('forms', mergedOptions);
  const formInfoList = (await resp.json()) as unknown[];

  if (!isFormInfoList(formInfoList)) {
    throw new Error('API type error');
  }

  return formInfoList;
};
