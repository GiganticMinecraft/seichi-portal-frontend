import { createApiClient } from '@/lib/api/createApiClient';

export const apiClient = createApiClient({ baseUrl: '/api/proxy' });
