import { getActiveTraceparent } from './traceparent';

/** Discord / Xbox Live / Minecraft Services など外部サービスへの fetch の上限時間 */
export const EXTERNAL_FETCH_TIMEOUT_MS = 10_000;

/** SSR / Route Handler から backend API への fetch の上限時間 */
export const BACKEND_FETCH_TIMEOUT_MS = 5_000;

/**
 * backend 側でさらに外部サービスを呼ぶ非冪等な操作 (startSession は Cloudflare
 * Turnstile、linkDiscord は Discord API) の上限時間。backend が外部呼び出しを
 * 終えてコミットした後に frontend だけが諦めると、Turnstile token や OAuth code は
 * 使い捨てのため再試行もできなくなる。外部サービス向けの上限より長く取る。
 */
export const BACKEND_MUTATION_FETCH_TIMEOUT_MS = 15_000;

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

/** SDK 呼び出しの `fetch` に渡す、BACKEND_MUTATION_FETCH_TIMEOUT_MS 版の fetch */
export const backendMutationFetch = createFetchWithTimeout(
  BACKEND_MUTATION_FETCH_TIMEOUT_MS
);

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

/** 外部サービスへの fetch がタイムアウトしたことを、どのサービスかと共に表す */
export class UpstreamTimeoutError extends Error {
  upstream: string;

  constructor(upstream: string, cause: unknown) {
    super(`${upstream} timed out after ${EXTERNAL_FETCH_TIMEOUT_MS}ms`, {
      cause,
    });
    this.name = 'UpstreamTimeoutError';
    this.upstream = upstream;
  }
}

/**
 * 外部サービスへ EXTERNAL_FETCH_TIMEOUT_MS の上限付きで fetch し、成功時は JSON を読む。
 * 上限はレスポンスボディの読み取りまで含み、タイムアウトは UpstreamTimeoutError に
 * 変換する。JSON として読めないボディは null。失敗レスポンスのボディは読まずに
 * 破棄し、keep-alive の接続を解放する。
 */
export const fetchUpstreamJson = async (
  upstream: string,
  url: string,
  init: Omit<RequestInit, 'signal'>
): Promise<{ ok: boolean; status: number; body: unknown }> => {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      return { ok: false, status: response.status, body: null };
    }

    const body: unknown = await response.json().catch((error: unknown) => {
      // ボディ読み取り中のタイムアウトは JSON 不正と区別して下の catch で扱う
      if (isTimeoutError(error)) throw error;
      return null;
    });
    return { ok: true, status: response.status, body };
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new UpstreamTimeoutError(upstream, error);
    }
    throw error;
  }
};
