import { APP_VERSION } from '@/env.client';
import { setFaro } from '@/lib/faro';
import { sanitizeTelemetryItem } from '@/lib/telemetry';

// 本番のみ初期化する。faro-web-tracing は OTel JS を同梱していてサイズが
// 大きいため、dynamic import で本体バンドルから専用チャンクに分離する。
const initFaro = async () => {
  if (process.env.NODE_ENV !== 'production') return;

  const [
    { getWebInstrumentations, initializeFaro },
    { TracingInstrumentation },
  ] = await Promise.all([
    import('@grafana/faro-web-sdk'),
    import('@grafana/faro-web-tracing'),
  ]);

  const faro = initializeFaro({
    // same-origin の /collect を next.config.js の rewrite でクラスタ内の
    // Alloy faro.receiver へプロキシする（CORS 不要・receiver 非公開のまま）。
    url: '/collect',
    // OAuth callback の認可コードなどを Loki/Tempo へ送信しない。
    beforeSend: sanitizeTelemetryItem,
    app: {
      // サーバ側の service.name (seichi-portal-frontend) と区別する。
      name: 'seichi-portal-browser',
      ...(APP_VERSION === undefined ? {} : { version: APP_VERSION }),
    },
    instrumentations: [
      // CSP 違反の計装は無効にする。Cloudflare Page Shield がサンプリングした
      // ページ応答に Report-Only CSP (connect-src 'none') を付けるため、/collect
      // への送信自体が securitypolicyviolation になり、その違反イベントをまた
      // /collect へ送る無限ループになる (Firefox では dedupe が効かず毎秒 1 件、
      // 1 日 8 万件超がブラウザ telemetry の 99% を占めていた)。
      ...getWebInstrumentations({
        enableContentSecurityPolicyInstrumentation: false,
      }),
      // same-origin への fetch には traceparent が自動付与されるため
      // propagateTraceHeaderCorsUrls の設定は不要。
      new TracingInstrumentation(),
    ],
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    ignoreErrors: [/ResizeObserver/],
  });

  setFaro(faro);
};

void initFaro();
