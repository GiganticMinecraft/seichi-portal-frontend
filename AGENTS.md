# seichi-portal-frontend — Agent Guide

## パッケージマネージャー

`pnpm` を使う（Node.js 24.14.1 / pnpm 10.33.0 — `mise.toml` で管理）。

## 技術スタック

- **フレームワーク**: Next.js (App Router), React 19
- **UI**: Material UI (MUI) v7, Emotion
- **認証**: Microsoft MSAL (@azure/msal-browser / @azure/msal-react)
- **API**: openapi-fetch, Zodios, SWR
- **バリデーション**: Zod v4
- **フォーム**: React Hook Form
- **その他**: fp-ts, ts-pattern, dayjs
- **言語**: TypeScript 5 (`@tsconfig/strictest` ベースの strict モード)
- **Lint/Format**: ESLint 9 (flat config), Prettier
- **Git フック**: Lefthook

## 重要な規約

- `src/generated/` は手動編集禁止。スキーマ変更後は `pnpm codegen` を実行する。
- パス alias `@/*` → `./src/*`
