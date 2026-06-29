import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import { importX } from 'eslint-plugin-import-x'
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from 'typescript-eslint'
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

const typescriptStrictnessConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-assertions": ["error", {
      assertionStyle: "never",
    }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unsafe-type-assertion": "error",
  },
};

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/**',
  ]),
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintReactConfig,
  reactHooks.configs.flat.recommended,
  unusedImportConfig,
  typescriptStrictnessConfig,
  prettier,
  ...nextVitals,
]);
