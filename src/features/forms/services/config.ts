import { Options } from 'ky';

import { API_URL } from '@/config';

export const BACKEND_API_OPTIONS: Options = {
  prefixUrl: API_URL,
};
