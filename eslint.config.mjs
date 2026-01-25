// @ts-check
import { defineConfig } from "eslint/config";
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  prettier,
]);
