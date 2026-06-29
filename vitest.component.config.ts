import { mergeConfig, defineConfig } from 'vitest/config';

import baseConfig from './vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    ssr: {
      noExternal: [/^@mui\//, 'react-transition-group'],
    },
    test: {
      environment: 'jsdom',
      include: ['tests/component/**/*.test.tsx'],
      server: {
        deps: {
          inline: [/@mui[+/]/, /react-transition-group/],
        },
      },
      setupFiles: ['tests/component/setup.ts'],
    },
  })
);
