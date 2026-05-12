# seichi-portal-frontend

このリポジトリは、Seichi Portalのフロントエンド実装です。

プロジェクトの目的やバックエンドなどの関連リポジトリについては、[seichi-portal](https://github.com/GiganticMinecraft/seichi-portal)を参照してください。

## API定義

Seichi Portalではフロントエンドとバックエンド間の通信に REST APIを使っています。詳細については、[seichi-portal-backend](https://github.com/GiganticMinecraft/seichi-portal-backend)および[seichi-portal-api-schema](https://github.com/GiganticMinecraft/seichi-portal-api-schema)を参照してください。

## 開発環境とミドルウェア

[CONTRIBUTING.md](./CONTRIBUTING.md)を参照してください。

## 認証・認可

- 保護ルートの認証確認は server 側で行います。
- `/admin` を含む保護ルートは、backend に到達できない場合も `fail-closed` で閉じます。
- middleware (`src/proxy.ts`) は軽量な入口判定だけを担い、厳密な user / role 判定は App Router の layout/page 側で行います。

## テスト

- 単体テスト: `pnpm test:unit`
- E2E テスト: `pnpm test:e2e`
- まとめて実行: `pnpm test`

## ライセンス

[Apache Licence 2.0](https://github.com/GiganticMinecraft/seichi-portal-frontend/blob/main/LICENSE)
