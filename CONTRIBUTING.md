# seichi-portal-frontendの開発について

## 必要なツールやミドルウェア

- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)
- [Next.js](https://nextjs.org/)
- [MUI](https://mui.com/)

## 環境変数

環境変数は [.env.example](./.env.example) を参考に、`.env.local` ファイルを作成して設定してください。

| 環境変数名                      | 意味                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_MS_APP_CLIENT_ID    | Microsoft アカウントログイン用の CLIENT ID                                                                 |
| NEXT_PUBLIC_MS_APP_REDIRECT_URL | ログイン後にリダイレクトされるデフォルトの URL                                                             |
| BACKEND_SERVER_URL              | [seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend) にアクセスできるリンク |
| DEBUG_MODE                      | デバッグモードを有効にします                                                                               |

> [!TIP]
>
> `NEXT_PUBLIC_MS_APP_CLIENT_ID` は Microsoft アカウントによる認証に必要な環境変数のため、 `DEBUG_MODE` が `true` のときは設定されていなくても問題ありません。

## デバッグモード

環境変数から設定できるデバッグモードは、Microsoft アカウントの認証を必要とせずにログインが必要なページを開くことできるようになるモードです。

> [!TIP]
> デバッグモードは以下の条件がすべて満たされている必要があります
>
> - `DEBUG_MODE`(環境変数)が `true` に設定されていること
> - seichi-portal-backend がデバッグモードで起動されていること
> - seichi-portal-frontend が開発モードで起動されていること(`yarn dev` コマンド)

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
yarn dev
```

## code formatter と lint

### フォーマットと auto fix の実行

```bash
yarn pretty
```

### フォーマットのみ実行

```bash
yarn fmt:fix
```

### auto fix の実行

```bash
yarn fix:fix
```
