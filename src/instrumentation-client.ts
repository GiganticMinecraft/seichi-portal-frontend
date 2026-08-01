import { APP_VERSION } from '@/env.client';
import { setFaro } from '@/lib/faro';

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
    app: {
      // サーバ側の service.name (seichi-portal-frontend) と区別する。
      name: 'seichi-portal-browser',
      ...(APP_VERSION === undefined ? {} : { version: APP_VERSION }),
    },
    instrumentations: [
      ...getWebInstrumentations(),
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
