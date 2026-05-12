import { defineConfig } from '@playwright/test';

const port = 3100;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  webServer: {
    command: `pnpm dev --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    env: {
      BACKEND_SERVER_URL: 'http://127.0.0.1:9',
      NEXT_PUBLIC_MS_APP_CLIENT_ID: 'test-client-id',
      NEXT_PUBLIC_MS_APP_REDIRECT_URL: `http://127.0.0.1:${port}/login`,
      NEXT_PUBLIC_DEBUG_MODE: 'false',
    },
  },
});
