# seichi-portal-frontend の開発について

## 必要なツール

開発に必要な Node.js と pnpm のバージョンは `mise.toml` で管理しています。プロジェクトのルートで以下を実行すると、正しいバージョンが揃います。

```bash
mise install
```

mise を使えない場合は、`mise.toml` に書かれたバージョンに合わせて個別にインストールしてください。

## 環境変数

[.env.example](./.env.example) を参考に `.env.local` を作成してください。

| 環境変数名                      | 用途                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| MS_APP_CLIENT_ID                | Microsoft アカウントログイン用の CLIENT ID                                                                 |
| MS_APP_REDIRECT_URL             | ログイン後にリダイレクトされる URL                                                                         |
| BACKEND_SERVER_URL              | [seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend) の URL                 |
| DISCORD_CLIENT_ID               | Discord 連携用 OAuth クライアント ID                                                                       |
| DISCORD_CLIENT_SECRET           | Discord 連携用 OAuth クライアントシークレット                                                              |
| DISCORD_REDIRECT_URI            | Discord OAuth コールバック URL                                                                             |
| NEXT_PUBLIC_DEBUG_MODE          | デバッグモードの有効化                                                                                     |

> [!TIP]
>
> `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` / `DISCORD_REDIRECT_URI` はサーバ側専用の環境変数です。`NEXT_PUBLIC_*` を付けずに設定してください。

## デバッグモード

Microsoft アカウントの認証なしで、ログインが必要なページを開けるモードです。

> [!TIP]
> 以下の条件をすべて満たす必要があります。
>
> - `NEXT_PUBLIC_DEBUG_MODE` が `true` に設定されていること
> - seichi-portal-backend がデバッグモードで起動されていること
> - seichi-portal-frontend が `pnpm dev` で起動されていること

## ディレクトリ構成と責務

ページの配置は [Next.js App Router](https://nextjs.org/docs/app) の規約に従います。以下では、各ディレクトリが何を担うかを説明します。

### `src/app`

App Router のルーティング階層です。ページ (`page.tsx`) とレイアウト (`layout.tsx`) を配置します。

| ディレクトリ | 責務 |
|---|---|
| `(protected)` | 認証済みユーザーだけがアクセスできるページ。`(standard)` は一般ユーザー向け、`admin` は管理者向け。 |
| `(public)` | 認証なしでアクセスできるページ。 |
| `api` | バックエンドへのプロキシなど、サーバ側 API ルートを配置する。 |
| `_components` | `src/app` 内で共有する UI コンポーネント。 |
| `_providers` | React Context の Provider をまとめる。 |
| `_swr` | SWR のフェッチャーやクエリフックを配置する。 |

### `src` 直下

| ディレクトリ | 責務 |
|---|---|
| `generated` | `pnpm codegen` で自動生成される API 型定義。**手動編集禁止**。 |
| `hooks` | ページ横断で使うカスタムフック。 |
| `lib` | API クライアント、エラー型、リダイレクト処理など、フレームワークに依存しないロジック。`lib/server` にはサーバ側専用のコードを置く。 |
| `_schemas` | Zod スキーマ。フォーム入力のバリデーションなどに使う。 |
| `generic` | プロジェクト全体で使う汎用的なユーティリティ型や関数。 |
| `user-token` | Minecraft トークンなど、ユーザー固有のトークンを扱うモジュール。 |

### 新しいコードを置く場所の判断基準

- **ページ固有の UI** → そのページの `_components` ディレクトリ
- **複数ページで使う UI** → `src/app/_components`
- **データ取得や状態操作のフック** → `src/hooks`
- **API 呼び出しや型変換のロジック** → `src/lib`
- **バリデーションスキーマ** → `src/_schemas`

## 認証・認可の境界

- 保護ルートの認証確認はサーバ側で行います。
- `/admin` を含む保護ルートは、バックエンドに到達できない場合も fail-closed（アクセス拒否）で閉じます。
- middleware (`src/proxy.ts`) は軽量な入口判定だけを担い、ユーザーやロールの厳密な判定は App Router の layout/page 側で行います。

## API 型と生成コード

API 型定義の正の情報源は [seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend) の OpenAPI スキーマです。

- `src/generated/` は `pnpm codegen` で生成されるファイルだけを置きます。手動で編集しないでください。
- バックエンドのスキーマが変わったら `pnpm codegen` を再実行してください。
- 詳しい使い方は [README.md](./README.md) の「API 定義」を参照してください。

## 開発環境の起動

環境変数の設定と seichi-portal-backend の起動が済んだら、以下を実行してください。

```bash
pnpm dev
```

## コードの検査と整形

| コマンド | 内容 |
|---|---|
| `pnpm pretty` | lint の自動修正、フォーマット、ビルドチェックをまとめて実行 |
| `pnpm lint:fix` | ESLint の自動修正のみ |
| `pnpm fmt:fix` | Prettier のフォーマットのみ |
