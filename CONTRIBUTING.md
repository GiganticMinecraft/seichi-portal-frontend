# How to contribute

## 開発を開始するには

1. `git submodule update --init --recursive`
Submoduleをpullします。
1. `yarn install`
依存関係をインストールします。
1. `yarn prepare`
[husky](https://github.com/typicode/husky)をセットアップします。これによって、`git commit`時に毎回ESLintとPrettierが実行されます。
1. `yarn api`
OpenAPIの定義ファイルからAPIクライアントの型を生成します。これには、[@redocly-cli](https://github.com/Redocly/redocly-cli)と[openapi2aspida](https://github.com/aspida/openapi2aspida)を利用しています。
1. `yarn dev`
開発用サーバーを起動します。[http://localhost:3000](http://localhost:3000)でアクセスできます。
このとき、[prism](https://github.com/stoplightio/prism)によって、OpenAPIに準拠したAPIサーバーが起動します。開発中は、バックエンドサーバーの代わりに、このサーバーを使用します。（アドレスは同じです）

## テスト

### 単体テスト

StorybookとJestの2種類のライブラリを用いてテストを記載しています。

* Storybook
  * `yarn sb:test`
  * または次の手順でも確認できます。
    1. `yarn sb`でStorybookを起動します。
    1. <http://localhost:9001>にアクセスします。
    1. 各コンポーネントの`Interactions`タブを開きます。
  * UIコンポーネントは、基本的にStorybookを使用してカタログを作成しています。
  * 同時にテストをCLIだけでなく視覚的に実行できます。
* Jest
  * `yarn test`
  * Storybookで実行できるものを含め、全ての単体テストはJestを使用してテストを実行できます。

### 結合テスト

未実装です。

### E2Eテスト

未実装です。

## ディレクトリ構造

[こちらの記事](https://zenn.dev/yodaka/articles/eca2d4bf552aeb)を参考にして作成しています。

// TODO: 直接ファイルツリーに説明を書かない？

```tree
├── openapi: git submoduleです。seichi-api-schemaリポジトリの内容です。
└── src
    ├── api: 自動生成されたバックエンドの型定義です。
    ├── components
    │   ├── elements: 共通して使用できるUIコンポーネントの定義です。
    │   └── pages: 実際の各ページでレンダリングされる内容を定義するコンポーネントの定義です。
    ├── config: 共通して使用できる設定の定義です。
    ├── const: 共通して使用できる定数の定義です。
    ├── features: ある特定の機能やドメインでしか使わないものを集めたディレクトリです。
    │   └── user: ユーザー管理周りです。
    │       ├── api: バックエンドを含む外部との通信を行う関数の定義です。
    │       ├── components: ユーザーを扱うUIコンポーネントです。
    │       ├── config: UIコンポーネントに必要な設定です。
    │       ├── hooks: ユーザー周りのReact Hooksです。
    │       ├── stores: ユーザー周りの状態管理です。
    │       └── types: ユーザー周りに必要な型の定義です。
    ├── libs: 共通して使用できる関数等の定義です。
    ├── pages: Next.jsのルーティング用のディレクトリです。コンポーネントの詳細は記載しません。
    └── types: 共通して使用できる型の定義です。
```

## コミットメッセージ規約

* [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)に従ってください。
* 「型」は、原則[Angularの規約](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)に従いますが、これら以外も許容します。

## コーディング規約

1. 基本は[
TypeScript Deep Dive 日本語版 スタイルガイド（コーディング規約）](https://typescript-jp.gitbook.io/deep-dive/styleguide)に従ってください。
ただし、この後の内容と矛盾する内容がある場合は、この後の内容のほうが優先されます。
1. ESLint及びPrettierの実行結果に従ってください。
1. 1コミットあたりの粒度はなるべく最小限になるようにしてください。
1. できる限り`interface`よりは`type`を使用してください。
これは不必要な`extends`や、意図せず同名の`interface`を定義した際に型が合成されることを避けるためです。
1. `Enum`は使用しないでください。代わりに`Union`型を使用してください。詳細は、[こちらのサイト](https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums)を参照してください。
1. Reactコンポーネントの定義にはアロー関数を使用してください。
1. `export default`よりは名前付き`export`を使用してください。
1. 型アサーション（`as`）は使用しないでください。コンパイラの型推論が明らかに間違っていて、アサーション先の型にしかならない場合にのみ使用してください。
また、使用する際には、なぜ使用できるのかという理由を記載してください。
1. 非nullアサーション演算子（`!`や`!!`）は使用しないでください。明らかに`null`または`undefined`にならない場合にのみ使用してください。
また、使用する際には、なぜ使用できるのかという理由を記載してください。
1. `any`型は使用しないでください。
