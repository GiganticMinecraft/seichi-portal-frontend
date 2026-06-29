# seichi-portal-frontend — Agent Guide

## パッケージマネージャー

`pnpm` を使う（バージョンは `mise.toml` と `package.json` の `packageManager` フィールドで管理）。

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

- `src/generated/` は手動編集禁止。スキーマ変更後は `pnpm codegen` を実行する。
- パス alias `@/*` → `./src/*`
- 保護ルートの認証確認はサーバ側で行う。middleware は入口判定のみ。
