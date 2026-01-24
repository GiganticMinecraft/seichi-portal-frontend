// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importXPlugin from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-config-prettier";
import { fixupPluginRules } from "@eslint/compat";
import preferArrow from "eslint-plugin-prefer-arrow";

export default tseslint.config(
  // 無視パターン
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },

  // 基本設定
  eslint.configs.recommended,

  // TypeScript設定（型チェック付き）
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React設定
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      // eslint-plugin-react-hooks v7 で追加された新ルールを無効化（既存コードとの互換性維持）
      "react-hooks/set-state-in-effect": "off",
    },
  },

  // Next.js設定
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Import設定 (import-x)
  importXPlugin.flatConfigs.recommended,
  importXPlugin.flatConfigs.typescript,
  {
    rules: {
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["index", "sibling", "parent"],
            "object",
            "type",
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "@",
              group: "internal",
              position: "before",
            },
          ],
        },
      ],
    },
  },

  // 未使用インポート設定
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // prefer-arrow設定（互換性ラッパー使用）
  {
    plugins: {
      "prefer-arrow": fixupPluginRules(preferArrow),
    },
  },

  // TypeScript固有ルール
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  // Prettier統合（最後に配置）
  prettierConfig
);
