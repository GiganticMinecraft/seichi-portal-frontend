/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 祖先ディレクトリの lockfile によって workspace root が誤推定されると
  // standalone 出力のレイアウト (server.js の位置や node_modules への相対
  // symlink) が環境依存で変わるため、プロジェクト直下に固定する
  outputFileTracingRoot: __dirname,
  // @pyroscope/nodejs は native モジュール (@datadog/pprof) を含むため
  // バンドルせず実行時 require にする (instrumentation.ts から利用)。
  // standalone 出力へは instrumentation.js.nft.json のトレース経由で
  // .pnpm レイアウトごとコピーされる
  serverExternalPackages: ['@pyroscope/nodejs'],
  // ブラウザの Faro (instrumentation-client.ts) からの same-origin 送信を
  // クラスタ内の Alloy faro.receiver へプロキシする（receiver は非公開のまま）。
  rewrites: async () => [
    {
      source: '/collect',
      destination:
        'http://k8s-monitoring-alloy-receiver.monitoring.svc.cluster.local:12347/collect',
    },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
};

module.exports = nextConfig;
