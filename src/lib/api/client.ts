import createClient from 'openapi-fetch';
import type { ApiPaths } from '@/lib/api/types';

export const apiClient = createClient<ApiPaths>({ baseUrl: '/api/proxy' });
