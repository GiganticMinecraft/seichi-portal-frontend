import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api-types';

export const proxyClient = createClient<paths>({ baseUrl: '/api/proxy' });
