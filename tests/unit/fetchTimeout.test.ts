import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createFetchWithTimeout,
  isTimeoutError,
} from '@/lib/server/fetchTimeout';

const toError = (reason: unknown): Error =>
  reason instanceof Error ? reason : new Error(String(reason));

// signal が abort されるまで解決しない fetch。abort されたら reason で reject する
const hangingFetch = vi.fn(
  (_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      signal?.addEventListener('abort', () => {
        reject(toError(signal.reason));
      });
    })
);

afterEach(() => {
  vi.unstubAllGlobals();
  hangingFetch.mockClear();
});

describe('createFetchWithTimeout', () => {
  it('応答が無い fetch を上限時間で TimeoutError として reject する', async () => {
    vi.stubGlobal('fetch', hangingFetch);
    const fetchWithTimeout = createFetchWithTimeout(20);

    const error: unknown = await fetchWithTimeout(
      new Request('http://backend.invalid/forms')
    ).catch((e: unknown) => e);

    expect(isTimeoutError(error)).toBe(true);
  });

  it('リクエストごとに別の signal を付け、先行リクエストのタイムアウトが後続に波及しない', async () => {
    vi.stubGlobal('fetch', hangingFetch);
    const fetchWithTimeout = createFetchWithTimeout(20);

    await fetchWithTimeout('http://backend.invalid/a').catch(() => undefined);

    const okFetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          if (init?.signal?.aborted) {
            reject(toError(init.signal.reason));
            return;
          }
          resolve(new Response('ok'));
        })
    );
    vi.stubGlobal('fetch', okFetch);

    await expect(
      fetchWithTimeout('http://backend.invalid/b')
    ).resolves.toBeInstanceOf(Response);
    expect(hangingFetch.mock.calls[0]?.[1]?.signal).not.toBe(
      okFetch.mock.calls[0]?.[1]?.signal
    );
  });

  it('呼び出し元の signal による中断も伝える', async () => {
    vi.stubGlobal('fetch', hangingFetch);
    const fetchWithTimeout = createFetchWithTimeout(60_000);
    const controller = new AbortController();

    const pending = fetchWithTimeout(
      new Request('http://backend.invalid/forms', {
        signal: controller.signal,
      })
    );
    controller.abort();

    const error: unknown = await pending.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DOMException);
    expect(isTimeoutError(error)).toBe(false);
  });
});

describe('createFetchWithTimeout の Request 展開', () => {
  it('Request は URL 文字列と init に展開し、method / headers / body を保ったまま signal を init に載せる', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response());
    vi.stubGlobal('fetch', fetchMock);

    await createFetchWithTimeout(1_000)(
      new Request('http://backend.invalid/session', {
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
        body: JSON.stringify({ expires_at: 'x' }),
        cache: 'no-cache',
      })
    );

    const [input, init] = fetchMock.mock.calls[0] ?? [];
    expect(input).toBe('http://backend.invalid/session');
    expect(init?.method).toBe('POST');
    expect(init?.cache).toBe('no-cache');
    expect(new Headers(init?.headers).get('authorization')).toBe(
      'Bearer token'
    );
    expect(init?.body).toBeInstanceOf(ArrayBuffer);
    expect(
      new TextDecoder().decode(
        init?.body instanceof ArrayBuffer ? init.body : undefined
      )
    ).toBe(JSON.stringify({ expires_at: 'x' }));
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
});

describe('isTimeoutError', () => {
  it('TimeoutError とその cause を判定する', () => {
    const timeout = new DOMException('timed out', 'TimeoutError');

    expect(isTimeoutError(timeout)).toBe(true);
    expect(isTimeoutError(new Error('wrapped', { cause: timeout }))).toBe(true);
    expect(isTimeoutError(new DOMException('aborted', 'AbortError'))).toBe(
      false
    );
    expect(isTimeoutError(new TypeError('fetch failed'))).toBe(false);
    expect(isTimeoutError(undefined)).toBe(false);
  });
});
