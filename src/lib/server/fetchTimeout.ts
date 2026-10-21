import { getActiveTraceparent } from './traceparent';

/** Discord / Xbox Live / Minecraft Services など外部サービスへの fetch の上限時間 */
export const EXTERNAL_FETCH_TIMEOUT_MS = 10_000;

/** SSR / Route Handler から backend API への fetch の上限時間 */
export const BACKEND_FETCH_TIMEOUT_MS = 5_000;

/**
 * 呼び出しごとに新しい AbortSignal.timeout を付けて globalThis.fetch を呼ぶ fetch を返す。
 *
 * - signal をクライアント作成時に 1 つだけ作って共有すると、最初のタイムアウト以降の
 *   リクエストがすべて即座に abort されるため、必ずリクエストごとに作る。
 * - 呼び出し元 (Request または init) の signal があればそれとも合成する。
 * - Request オブジェクトはそのまま渡さず、URL 文字列と init に展開して渡す。Next.js の
 *   patch-fetch は Request 入力を `new Request(...)` で 2 回作り直し、signal は
 *   作り直した Request 間で undici の WeakRef 経由でしか繋がらない。途中の Request が
 *   GC されると abort が伝わらず、タイムアウトしても接続が残り続ける
 *   (起動直後の初回リクエストで再現した)。init.signal なら originFetch へ直接渡る。
 * - globalThis.fetch は Next.js が実行時に差し替えるため、呼び出し時点で参照する。
 */
export const createFetchWithTimeout =
  (timeoutMs: number): typeof fetch =>
  async (input, init) => {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const callerSignal =
      init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const signal = callerSignal
      ? AbortSignal.any([timeoutSignal, callerSignal])
      : timeoutSignal;

    if (!(input instanceof Request)) {
      return globalThis.fetch(input, { ...init, signal });
    }

    // backend への body は小さな JSON のみなので、ストリームのまま渡す (duplex 指定が
    // 必要になる) より読み切って渡す
    const body = input.body === null ? undefined : await input.arrayBuffer();

    return globalThis.fetch(input.url, {
      method: input.method,
      headers: input.headers,
      ...(body === undefined ? {} : { body }),
      cache: input.cache,
      credentials: input.credentials,
      integrity: input.integrity,
      keepalive: input.keepalive,
      mode: input.mode,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      ...init,
      signal,
    });
  };

/**
 * AbortSignal.timeout による中断かを判定する。fetch は signal の reason
 * (name が TimeoutError の DOMException) をそのまま reject するが、
 * ラップされた場合に備えて cause も辿る。
 */
export const isTimeoutError = (error: unknown): boolean => {
  let current: unknown = error;
  for (let depth = 0; depth < 5; depth++) {
    if (typeof current !== 'object' || current === null) return false;
    if (Reflect.get(current, 'name') === 'TimeoutError') return true;
    current = Reflect.get(current, 'cause');
  }
  return false;
};

/** 外部サービス / backend への fetch がタイムアウトしたことを構造化ログに出す */
export const logUpstreamTimeout = ({
  upstream,
  timeoutMs,
  route,
}: {
  upstream: string;
  timeoutMs: number;
  route: string;
}) => {
  console.error(
    JSON.stringify({
      msg: 'upstream request timed out',
      upstream,
      timeoutMs,
      route,
      traceparent: getActiveTraceparent(),
    })
  );
};
