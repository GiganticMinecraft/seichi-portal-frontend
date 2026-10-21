import { trace } from '@opentelemetry/api';

/**
 * アクティブな span の W3C traceparent を返す。span が無いときは undefined。
 * Loki 側でトレースと突き合わせるため、サーバー側の構造化ログに載せる。
 */
export const getActiveTraceparent = (): string | undefined => {
  const spanContext = trace.getActiveSpan()?.spanContext();
  if (spanContext === undefined) return undefined;

  return `00-${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags
    .toString(16)
    .padStart(2, '0')}`;
};
