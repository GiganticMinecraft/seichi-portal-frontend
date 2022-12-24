import { apiClient } from './config';

export const getForm = async (formId: number) =>
  // eslint-disable-next-line no-underscore-dangle
  apiClient.forms._formId(formId).$get();
