# seichi-portal-frontend の開発について

## 必要なツール

[Nix](https://nixos.org/) が使える場合は、リポジトリ直下の `flake.nix` から mise を起動し、`mise.toml` で指定した Node.js と pnpm をインストールします。

```bash
nix develop
```

[direnv](https://direnv.net/) を使っている場合は、`.envrc` に次の内容を書いて `direnv allow` で許可すると、ディレクトリに入るだけでこのシェルが有効になります。`mise.toml` の変更時も読み直します。

```bash
watch_file mise.toml
use flake
```

Nix を使わない場合は、Node.js と pnpm のバージョンを `mise.toml` で管理しています。プロジェクトのルートで以下を実行すると、正しいバージョンが揃います。

```bash
mise install
```

mise も使えない場合は、`mise.toml` に書かれたバージョンに合わせて個別にインストールしてください。

### Node.js のセキュリティ更新

Renovate は `mise.toml` の Node.js、`Dockerfile` の公式 Node.js イメージ、`@types/node` を同じ PR で更新します。Nix の開発環境と CI も `mise.toml` に従います。`@types/node` のバージョンはランタイムと独立しているため、数値そのものは一致しません。

`Dockerfile` の `ARG NODE_VERSION` はカスタムマネージャーで検出し、mise と同じ `node-version` データソースを使います。Docker の通常の更新検出は Node.js に限って無効にし、リリース日の違いで待機期間の判定がずれることを防ぎます。

Docker では Debian 13 の公式 Node.js イメージでビルドし、同じ Node.js バイナリを本番用の distroless `cc-debian13` にコピーします。distroless の Node.js 配布時期に依存せず、ビルドと本番のバージョンを揃えるためです。distroless の OS 更新は digest の変更として Renovate が別に管理します。

CI の `Container runtime` ジョブで本番イメージをビルドし、Node.js のバージョンが `mise.toml` と一致することと、公開ページが HTTP 200 を返すことを確認します。ローカルでも次のコマンドで本番イメージの Node.js を確認できます。

```bash
docker build --pull -t seichi-portal-frontend:local .
docker run --rm seichi-portal-frontend:local --version
```

リリース時は `pull: true` でベースイメージを取得し直します。Debian の世代変更時は Node.js のコピー元と distroless の両方を確認してください（[distroless のサポート対象](https://github.com/GoogleContainerTools/distroless#what-images-are-available)）。

通常更新には共有 Renovate 設定の 7 日待機が適用されます。Dependabot alerts は `mise.toml` や Docker イメージ内の Node.js 本体を検査しないため、セキュリティ修正版でも待機が自動で解除されるとは限りません。通知がない場合も [Node.js のセキュリティ情報](https://nodejs.org/en/blog/vulnerability)を確認してください。

## 環境変数

[.env.example](./.env.example) を参考に `.env.local` を作成してください。

| 環境変数名                      | 用途                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| MS_APP_CLIENT_ID                | Microsoft アカウントログイン用の CLIENT ID                                                                 |
| MS_APP_REDIRECT_URL             | ログイン後にリダイレクトされる URL                                                                         |
| BACKEND_SERVER_URL              | [seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend) の URL                 |
| SEICHI_PROXY_SECRET             | バックエンドへ匿名リクエストを中継する共有秘密値（サーバ側専用）                                           |
| SEICHI_CLIENT_IP_HEADER        | ingress が設定するクライアント IP ヘッダー名（任意。サーバ側専用）                                          |
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
- 生成物が backend `main` のスキーマと一致しているかは CI の `OpenAPI codegen check` ジョブ（`pnpm codegen:check`）で自動検証されます。
- 詳しい使い方は [README.md](./README.md) の「API 定義」を参照してください。

生成は [@hey-api/openapi-ts](https://heyapi.dev/) で行います（設定は `openapi-ts.config.ts`）。
TypeScript 7 はコンパイラ API を同梱しないため、生成ツールは TypeScript のコンパイラ API に依存しない版を使っています。

- API は `src/generated/api/sdk.gen.ts` の SDK 関数で呼びます。operation ごとに関数があり、クライアントを `client` で渡します。

  ```ts
  import * as sdk from '@/generated/api/sdk.gen';
  import { withResponse } from '@/lib/api/createApiClient';
  import { proxyClient } from '@/lib/proxyClient';

  const { data, error, response } = await withResponse(
    sdk.getFormHandler({ client: proxyClient, path: { form_id: formId } })
  );
  ```

- ブラウザからは `proxyClient`、サーバ（RSC / Route Handler）からは `serverApiClient`（`src/lib/server/backend.ts`）を使います。サーバ側は `requireBackendData` / `requireBackendResponse` に渡すとエラーを `BackendError` にそろえられます。
- 型は `src/generated/api/types.gen.ts` から `import type * as Api from '@/generated/api/types.gen'` で参照します（例: `Api.FormSchema`、`Api.GetFormHandlerResponses[200]`）。
- SWR の `useApiQuery` / `useInfiniteApiQuery` はパス文字列で GET します。対応表 `src/generated/api/get-operations.gen.ts` も `pnpm codegen` が生成します。

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
