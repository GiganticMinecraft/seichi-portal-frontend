import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api-types';

export const apiClient = createClient<paths>({ baseUrl: '/api/proxy' });
