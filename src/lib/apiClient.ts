import { createApiClient } from '@/generated/api-client';

// クライアントサイドから /api/proxy/* へアクセス
// Next.js middleware が BACKEND_SERVER_URL へ転送する
export const apiClient = createApiClient('/api/proxy');
