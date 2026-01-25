// @ts-check
import { defineConfig } from "eslint/config";
import prettier from 'eslint-config-prettier/flat'

export default defineConfig({
  ...prettier,
  ignores: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ],
});
