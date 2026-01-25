import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import { importX } from 'eslint-plugin-import-x'
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks"
import unusedImports from 'eslint-plugin-unused-imports'

const eslintReactConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    pluginReactConfig,
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
};

const unusedImportConfig = {
  plugins: {
    "unused-imports": unusedImports,
  },
  rules: {
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
      },
    ]
  },
}

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintReactConfig,
  reactHooks.configs.flat.recommended,
  unusedImportConfig,
  prettier,
  ...nextVitals,
]);
