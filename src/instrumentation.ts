import { SpanStatusCode, trace } from '@opentelemetry/api';
import type { SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { type Configuration, registerOTel } from '@vercel/otel';
import type { Instrumentation } from 'next';

import {
  getOtelExporterOtlpEndpoint,
  getOtelSdkDisabled,
  getPyroscopeServerAddress,
} from '@/env.server';

// Next.js は http.target にクエリ付きの生 URL を入れるため、クエリパラメータが
// トレース基盤へ漏れないよう落とす。
const stripUrlQuerySpanProcessor: SpanProcessor = {
  onStart: (span) => {
    for (const key of ['http.target', 'url.full']) {
      const value = span.attributes[key];
      if (typeof value !== 'string') continue;

      const queryIndex = value.indexOf('?');
      if (queryIndex === -1) continue;

      span.setAttribute(key, value.slice(0, queryIndex));
    }
  },
  onEnd: () => {},
  forceFlush: () => Promise.resolve(),
  shutdown: () => Promise.resolve(),
};

// Grafana Pyroscope への継続プロファイリング (push)。
// PYROSCOPE_SERVER_ADDRESS 未設定（ローカル dev など）では無効。
// @pyroscope/nodejs は native モジュール (@datadog/pprof) に依存するため、
// Node.js ランタイムでのみ動的 import する（edge バンドルへ含めない。
// next.config.js の serverExternalPackages も参照）。
//
// Next.js は register() 内の例外を再 throw してサーバー起動自体を失敗させる。
// プロファイラは任意機能なので、native モジュールのロード失敗や設定不備では
// エラーログのみ残して本体と OTel 計装の起動を続行させる。
export const startPyroscope = async () => {
  if (process.env['NEXT_RUNTIME'] !== 'nodejs') return;

  try {
    const serverAddress = getPyroscopeServerAddress();
    if (serverAddress === undefined) return;

    const { init, start } = await import('@pyroscope/nodejs');
    init({
      serverAddress,
      appName:
        process.env['PYROSCOPE_APPLICATION_NAME'] ?? 'seichi-portal-frontend',
      // CPU プロファイルの取得に必要
      wall: { collectCpuTime: true },
    });
    start();
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    console.error(
      JSON.stringify({
        msg: 'failed to start pyroscope profiler; continuing without profiling',
        error: { message: cause.message, stack: cause.stack },
      })
    );
  }
};

// メトリクスの送信間隔。Prometheus 側の scrape 間隔 (30s) に揃える。
const METRIC_EXPORT_INTERVAL_MILLIS = 30_000;

// サーバー側のメトリクス設定。
// HTTP の RED メトリクスは Tempo の span-metrics から作るため (seichi_infra #5604)、
// ここではトレースから導けない Node.js ランタイムの飽和度 (イベントループ遅延・
// ヒープ・GC) だけを OTLP で送る。exporter と計装は Node.js API に依存するため、
// Node.js ランタイムでのみ動的 import する（edge バンドルへ含めない）。
export const nodeMetricsConfiguration = async (): Promise<
  Pick<Configuration, 'instrumentations' | 'metricReaders'>
> => {
  if (process.env['NEXT_RUNTIME'] !== 'nodejs') return {};

  const [
    { OTLPMetricExporter },
    { PeriodicExportingMetricReader },
    { RuntimeNodeInstrumentation },
  ] = await Promise.all([
    import('@opentelemetry/exporter-metrics-otlp-proto'),
    import('@opentelemetry/sdk-metrics'),
    import('@opentelemetry/instrumentation-runtime-node'),
  ]);

  return {
    // 'auto' は既定の fetch 計装 (instrumentationConfig.fetch の設定込み)
    instrumentations: ['auto', new RuntimeNodeInstrumentation()],
    metricReaders: [
      new PeriodicExportingMetricReader({
        // endpoint などは OTEL_EXPORTER_OTLP_* 環境変数から読む
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: METRIC_EXPORT_INTERVAL_MILLIS,
      }),
    ],
  };
};

// backend への fetch に traceparent を付けるための propagateContextUrls の値。
// @vercel/otel は fetch 先を URL オブジェクトの文字列表現と前方一致で比べるが、
// URL は既定ポートを落とす（http://host:80/path → http://host/path）。
// BACKEND_SERVER_URL をそのまま渡すと本番の http://seichi-portal-backend:80 に一致せず、
// SSR から backend への呼び出しでトレースが途切れていたため、origin に正規化する。
// 末尾に / を付け、同じ前方一致を持つ別ホスト（seichi-portal-backend-foo など）を除外する。
export const backendPropagationUrls = (
  backendServerUrl: string | undefined
): string[] => {
  if (backendServerUrl === undefined) return [];

  try {
    return [`${new URL(backendServerUrl).origin}/`];
  } catch {
    return [];
  }
};

export const register = async () => {
  await startPyroscope();

  // @vercel/otel はエンドポイント未設定でも localhost:4318 へ送信しようとする
  // ため、未設定時（ローカル dev など）は明示的に計装を無効化する。
  if (getOtelSdkDisabled()) return;
  if (getOtelExporterOtlpEndpoint() === undefined) return;

  const backendServerUrl = process.env['BACKEND_SERVER_URL'];

  registerOTel({
    ...(await nodeMetricsConfiguration()),
    serviceName: 'seichi-portal-frontend',
    instrumentationConfig: {
      fetch: {
        // デフォルトでは同一デプロイメント以外の URL へ traceparent が伝播
        // しないため、backend への fetch を明示する。
        propagateContextUrls: backendPropagationUrls(backendServerUrl),
      },
    },
    spanProcessors: ['auto', stripUrlQuerySpanProcessor],
  });
};

const toError = (value: unknown): Error => {
  if (value instanceof Error) return value;
  if (typeof value === 'string') return new Error(value);

  return new Error(JSON.stringify(value));
};

export const onRequestError: Instrumentation.onRequestError = (
  error,
  errorRequest,
  errorContext
) => {
  const exception = toError(error);
  const span = trace.getActiveSpan();
  span?.recordException(exception);
  span?.setStatus({ code: SpanStatusCode.ERROR, message: exception.message });

  const spanContext = span?.spanContext();
  const digest =
    error instanceof Error &&
    'digest' in error &&
    typeof error.digest === 'string'
      ? error.digest
      : undefined;

  // Loki 側でトレースと突き合わせられるよう traceparent 付きの構造化ログを出す。
  console.error(
    JSON.stringify({
      msg: 'uncaught request error',
      error: { message: exception.message, stack: exception.stack, digest },
      path: errorRequest.path,
      method: errorRequest.method,
      routerKind: errorContext.routerKind,
      routePath: errorContext.routePath,
      routeType: errorContext.routeType,
      traceparent:
        spanContext === undefined
          ? undefined
          : `00-${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags
              .toString(16)
              .padStart(2, '0')}`,
    })
  );
};
