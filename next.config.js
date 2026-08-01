const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ブラウザの Faro (instrumentation-client.ts) からの same-origin 送信を
  // クラスタ内の Alloy faro.receiver へプロキシする（receiver は非公開のまま）。
  rewrites: async () => [
    {
      source: '/collect',
      destination:
        'http://k8s-monitoring-alloy-receiver.monitoring.svc.cluster.local:12347/collect',
    },
  ],
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
