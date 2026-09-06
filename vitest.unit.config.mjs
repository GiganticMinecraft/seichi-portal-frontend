import { mergeConfig, defineConfig } from 'vitest/config';

import baseConfig from './vitest.config.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['tests/unit/**/*.test.ts'],
    },
  })
);
