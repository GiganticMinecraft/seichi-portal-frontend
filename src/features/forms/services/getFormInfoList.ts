import { apiClient } from './config';

export const getFormInfoList = async () => apiClient.forms.$get();
