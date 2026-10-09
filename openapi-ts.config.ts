import { defineConfig } from '@hey-api/openapi-ts';

const DEFAULT_OPENAPI_URL =
  'https://raw.githubusercontent.com/GiganticMinecraft/seichi-portal-backend/main/docs/openapi.json';

export default defineConfig({
  input: process.env['OPENAPI_URL'] ?? DEFAULT_OPENAPI_URL,
  output: 'src/generated/api',
  plugins: [
    // fetch ベースのクライアント。インスタンスは src/lib/api/createApiClient.ts で作る
    '@hey-api/client-fetch',
    '@hey-api/typescript',
    '@hey-api/sdk',
  ],
});
