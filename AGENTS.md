# seichi-portal-frontend — Agent Guide

## パッケージマネージャー

`pnpm` を使う（バージョンは `mise.toml` と `package.json` の `packageManager` フィールドで管理）。

## 技術スタック

- **フレームワーク**: Next.js (App Router), React 19
- **UI**: Material UI (MUI) v7, Emotion
- **認証**: Microsoft MSAL (@azure/msal-browser / @azure/msal-react)
- **API**: @hey-api/openapi-ts (生成 SDK + fetch クライアント), Zodios, SWR
- **バリデーション**: Zod v4
- **フォーム**: React Hook Form
- **その他**: fp-ts, ts-pattern, dayjs
- **言語**: TypeScript 7 (`@tsconfig/strictest` ベースの strict モード)
  - `tsc` (型チェック) は `@typescript/native` (= `typescript@7`、ネイティブ実装)。
  - `typescript` は `@typescript/typescript6` の別名。TS 7.0 は JS API を同梱しないため、API を使うツール (typescript-eslint、Next.js のビルド時型チェック) は TS 6 で動く。TS 7.1 の API と typescript-eslint の対応 (typescript-eslint#10940) が出たら一本化する。
- **Lint/Format**: ESLint 9 (flat config), Prettier
- **Git フック**: Lefthook

## ディレクトリの責務

| ディレクトリ | 責務 |
|---|---|
| `src/app/(protected)` | 認証済みユーザー向けページ。`(standard)` は一般、`admin` は管理者向け。 |
| `src/app/(public)` | 認証なしでアクセスできるページ。 |
| `src/app/api` | サーバ側 API ルート。 |
| `src/generated` | `pnpm codegen` で自動生成。手動編集禁止。 |
| `src/hooks` | ページ横断のカスタムフック。 |
| `src/lib` | API クライアント、エラー型など。`lib/server` はサーバ専用。 |
| `src/_schemas` | Zod バリデーションスキーマ。 |
| `src/generic` | 汎用ユーティリティ型・関数。 |

## 重要な規約

- `src/generated/` は手動編集禁止。スキーマ変更後は `pnpm codegen` を実行する。整合性は CI の `pnpm codegen:check` で検証される。
- パス alias `@/*` → `./src/*`
- 保護ルートの認証確認はサーバ側で行う。middleware は入口判定のみ。
