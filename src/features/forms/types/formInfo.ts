import { isNonEmptyString } from '@/types';
import { isString } from '@/types/assertString';

import { isFormId } from './formId';

import type { Form } from './form';

export type FormInfo = Pick<Form, 'id' | 'formName' | 'description'>;

export const isFormInfo = (arg: unknown): arg is FormInfo => {
  const i = arg as FormInfo;

  return (
    isFormId(i?.id) && isNonEmptyString(i?.formName) && isString(i?.description)
  );
};

export const isFormInfoList = (args: unknown[]): args is FormInfo[] =>
  args.every((arg) => isFormInfo(arg));
