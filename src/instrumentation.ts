import { SpanStatusCode, trace } from '@opentelemetry/api';
import type { SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerOTel } from '@vercel/otel';
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
const startPyroscope = async () => {
  if (process.env['NEXT_RUNTIME'] !== 'nodejs') return;

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
};

export const register = async () => {
  await startPyroscope();

  // @vercel/otel はエンドポイント未設定でも localhost:4318 へ送信しようとする
  // ため、未設定時（ローカル dev など）は明示的に計装を無効化する。
  if (getOtelSdkDisabled()) return;
  if (getOtelExporterOtlpEndpoint() === undefined) return;

  const backendServerUrl = process.env['BACKEND_SERVER_URL'];

  registerOTel({
    serviceName: 'seichi-portal-frontend',
    instrumentationConfig: {
      fetch: {
        // デフォルトでは同一デプロイメント以外の URL へ traceparent が伝播
        // しないため、backend への fetch を明示する。
        propagateContextUrls:
          backendServerUrl === undefined ? [] : [backendServerUrl],
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
