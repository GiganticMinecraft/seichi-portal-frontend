# seichi-portal-frontendの開発について

## 目次

- [seichi-portal-frontendの開発について](#seichi-portal-frontendの開発について)
  - [目次](#目次)
  - [必要なツールやミドルウェア](#必要なツールやミドルウェア)
  - [環境変数](#環境変数)
  - [デバッグモード](#デバッグモード)
  - [ディレクトリ構成](#ディレクトリ構成)
    - [`src/app/(authed)`](#srcappauthed)
    - [`src/app/(unauthed)`](#srcappunauthed)
    - [`src/app/api`](#srcappapi)
    - [`src/components`](#srccomponents)
    - [`src/features/`](#srcfeatures)
    - [`generic`](#generic)
  - [開発環境の起動](#開発環境の起動)
  - [code formatter と lint](#code-formatter-と-lint)
    - [フォーマット、auto fix、ビルドチェックの実行](#フォーマットauto-fixビルドチェックの実行)
    - [フォーマットのみ実行](#フォーマットのみ実行)
    - [auto fix の実行](#auto-fix-の実行)

## 必要なツールやミドルウェア

seichi-portal-frontend の開発に必要なツールは以下の通りです:

- Node.js v22.14.0
- pnpm v10.7.0

これらのツールは [mise](https://github.com/jdx/mise) というツールを使用することでインストールすることができます。プロジェクトのルートディレクトリ上で以下のコマンドを実行してください。

```bash
mise install
```

何らかの理由で mise が使用できない場合は個別でインストールすることもできますが、必ずバージョンを合わせるようにしてください。

## 環境変数

環境変数は [.env.example](./.env.example) を参考に、`.env.local` ファイルを作成して設定してください。

| 環境変数名                      | 意味                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_MS_APP_CLIENT_ID    | Microsoft アカウントログイン用の CLIENT ID                                                                 |
| NEXT_PUBLIC_MS_APP_REDIRECT_URL | ログイン後にリダイレクトされるデフォルトの URL                                                             |
| NEXT_PUBLIC_BACKEND_SERVER_URL  | [seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend) にアクセスできるリンク |
| NEXT_PUBLIC_DEBUG_MODE          | デバッグモードを有効にします                                                                               |

> [!TIP]
>
> `NEXT_PUBLIC_MS_APP_CLIENT_ID` は Microsoft アカウントによる認証に必要な環境変数のため、 `NEXT_PUBLIC_DEBUG_MODE` が `true` のときは設定されていなくても問題ありません。

## デバッグモード

環境変数から設定できるデバッグモードは、Microsoft アカウントの認証を必要とせずにログインが必要なページを開くことできるようになるモードです。

> [!TIP]
> デバッグモードは以下の条件がすべて満たされている必要があります
>
> - `NEXT_PUBLIC_DEBUG_MODE`(環境変数)が `true` に設定されていること
> - seichi-portal-backend がデバッグモードで起動されていること
> - seichi-portal-frontend が開発モードで起動されていること(`pnpm run dev` コマンド)

## ディレクトリ構成

基本的には `src/app` ディレクトリ配下に [Next.js の App Router](https://nextjs.org/docs/app) に従って `page.tsx` や `route.ts` を配置していきます。

```tree
src
├── app
│   ├── (authed)
│   ├── (unauthed)
│   └── api
├── components
├── features
│   ├── form
│   └── user
└── generic
```

### `src/app/(authed)`

認証が行われたあとにのみアクセスできるページがまとめられたディレクトリ

### `src/app/(unauthed)`

認証が行われる前にもアクセスできるページがまとめられたディレクトリ

### `src/app/api`

主に、バックエンドと通信するときに必要な api を配置するディレクトリ

### `src/components`

各ページを作成するときに必要なコンポーネントを配置するディレクトリ

### `src/features/`

TODO: 後で書く

### `generic`

プロジェクト全体で使用する共通の型を定義するディレクトリ

## 開発環境の起動

環境変数の設定と seichi-portal-backend を起動した後、以下のコマンドを実行してください

```bash
pnpm run dev
```

## code formatter と lint

### フォーマット、auto fix、ビルドチェックの実行

```bash
pnpm run pretty
```

### フォーマットのみ実行

```bash
pnpm run fmt:fix
```

### auto fix の実行

```bash
pnpm run fmt:fix
```
