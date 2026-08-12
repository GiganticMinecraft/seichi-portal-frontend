'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  loadTurnstile,
  type TurnstileApi,
  TurnstileError,
} from '@/lib/turnstile';

type PendingToken = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

type ReadyWidget = {
  container: HTMLDivElement;
  turnstile: TurnstileApi;
  widgetId: string;
};

type WidgetReadiness = {
  promise: Promise<ReadyWidget>;
  reject: (error: Error) => void;
  resolve: (widget: ReadyWidget) => void;
};

const createWidgetReadiness = (): WidgetReadiness => {
  let resolve: (widget: ReadyWidget) => void = () => {};
  let reject: (error: Error) => void = () => {};
  const promise = new Promise<ReadyWidget>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  // effect の cleanup が、まだ呼び出し元のない readiness を reject しても
  // unhandled rejection にしない。await した側には reject がそのまま伝わる。
  void promise.catch(() => {});
  return { promise, reject, resolve };
};

/**
 * Cloudflare Turnstile のウィジェットを送信操作の直前に実行し、token を取得する。
 * `containerRef` は callback ref。呼び出し側の都合でコンテナがアンマウント/
 * 再マウントされても(送信完了で消え、再入力でまた現れる、など)そのたびに
 * widget を作り直すため、コンテナの生存期間を呼び出し側のレイアウトに合わせて
 * 自由に決められる。
 * `siteKey` は Server Component が実行時に読んだ `TURNSTILE_SITE_KEY` を props
 * 経由で渡す想定(NEXT_PUBLIC_ 化してビルド時に固定しないため)。未設定の環境
 * (backend の TURNSTILE_ENABLED=false に対応) では getToken は空文字列を返し、
 * ウィジェットも描画しない。
 */
export const useTurnstileToken = (
  action: string,
  siteKey: string | undefined
) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerNodeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    containerNodeRef.current = node;
    setContainer(node);
  }, []);
  const widgetIdRef = useRef<string | null>(null);
  const readinessRef = useRef<WidgetReadiness | null>(null);
  const pendingRef = useRef<PendingToken | null>(null);
  const pendingPromiseRef = useRef<Promise<string> | null>(null);
  const getReadiness = useCallback(() => {
    readinessRef.current ??= createWidgetReadiness();
    return readinessRef.current;
  }, []);

  useEffect(() => {
    if (!siteKey || !container) return;

    let widgetId: string | null = null;
    let cancelled = false;

    const readiness = getReadiness();
    void loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;

        widgetId = turnstile.render(container, {
          sitekey: siteKey,
          action,
          execution: 'execute',
          appearance: 'interaction-only',
          callback: (token) => {
            if (widgetIdRef.current !== widgetId) return;
            const pending = pendingRef.current;
            if (!pending) return;
            pendingRef.current = null;
            pendingPromiseRef.current = null;
            pending.resolve(token);
          },
          // Cloudflare Turnstile API が要求するキー名そのまま。
          /* eslint-disable @typescript-eslint/naming-convention */
          'error-callback': (errorCode) => {
            if (widgetIdRef.current !== widgetId) return true;
            const error = new TurnstileError(
              'Turnstile verification failed',
              errorCode
            );
            console.error('[Turnstile] widget error', error);
            const pending = pendingRef.current;
            pendingRef.current = null;
            pendingPromiseRef.current = null;
            pending?.reject(error);
            return true;
          },
          'expired-callback': () => {
            if (widgetIdRef.current !== widgetId) return true;
            const pending = pendingRef.current;
            pendingRef.current = null;
            pendingPromiseRef.current = null;
            pending?.reject(new TurnstileError('Turnstile token expired'));
            return true;
          },
          'timeout-callback': () => {
            if (widgetIdRef.current !== widgetId) return true;
            const pending = pendingRef.current;
            pendingRef.current = null;
            pendingPromiseRef.current = null;
            pending?.reject(
              new TurnstileError('Turnstile challenge timed out')
            );
            return true;
          },
          /* eslint-enable @typescript-eslint/naming-convention */
        });
        widgetIdRef.current = widgetId;
        readiness.resolve({ container, turnstile, widgetId });
      })
      .catch((error: unknown) => {
        const normalizedError =
          error instanceof Error
            ? error
            : new TurnstileError('Turnstile initialization failed');
        readiness.reject(normalizedError);
      });
    void readiness.promise.catch((error: unknown) => {
      if (!cancelled) {
        console.error('[Turnstile] widget initialization failed', error);
      }
    });

    return () => {
      cancelled = true;
      readiness.reject(new TurnstileError('Turnstile widget was unmounted'));
      if (widgetId) {
        window.turnstile?.remove(widgetId);
      }
      if (widgetIdRef.current === widgetId) {
        const pending = pendingRef.current;
        pendingRef.current = null;
        pendingPromiseRef.current = null;
        pending?.reject(new TurnstileError('Turnstile widget was unmounted'));
        widgetIdRef.current = null;
      }
      if (readinessRef.current === readiness) readinessRef.current = null;
    };
  }, [action, siteKey, container, getReadiness]);

  const getToken = useCallback(async (): Promise<string> => {
    if (!siteKey) return '';

    let readyWidget: ReadyWidget;
    for (;;) {
      const readiness = getReadiness();
      try {
        readyWidget = await readiness.promise;
      } catch (error: unknown) {
        // React の effect 再実行で widget 世代が切り替わった場合だけ、次の
        // readiness を待つ。初期化失敗や実際のアンマウントは呼び出し元へ返す。
        if (readinessRef.current === readiness || !containerNodeRef.current) {
          throw error;
        }
        continue;
      }

      if (
        widgetIdRef.current === readyWidget.widgetId &&
        containerNodeRef.current === readyWidget.container
      ) {
        break;
      }
      if (!containerNodeRef.current) {
        throw new TurnstileError('Turnstile widget was unmounted');
      }
    }

    const { container: readyContainer, turnstile, widgetId } = readyWidget;

    const existingPromise = pendingPromiseRef.current;
    if (existingPromise) return existingPromise;

    const tokenPromise = new Promise<string>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
    });
    pendingPromiseRef.current = tokenPromise;
    // 呼び出し元が結果を待たずに破棄しても、callback 失敗時に unhandled rejection
    // を発生させない。返す Promise 自体の reject は維持される。
    void tokenPromise.catch(() => {});

    const rejectToken = (error: unknown, fallbackMessage: string) => {
      if (pendingPromiseRef.current !== tokenPromise) return;
      const pending = pendingRef.current;
      pendingRef.current = null;
      pendingPromiseRef.current = null;
      const normalizedError =
        error instanceof Error ? error : new TurnstileError(fallbackMessage);
      console.error('[Turnstile] token acquisition failed', normalizedError);
      pending?.reject(normalizedError);
    };

    try {
      turnstile.reset(widgetId);
      turnstile.execute(readyContainer);
    } catch (error: unknown) {
      rejectToken(error, 'Turnstile execution failed');
    }

    return tokenPromise;
  }, [siteKey, getReadiness]);

  return { containerRef, getToken };
};
