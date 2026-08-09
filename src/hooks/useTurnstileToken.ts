'use client';

import { useCallback, useEffect, useRef } from 'react';

import { loadTurnstile } from '@/lib/turnstile';

type PendingToken = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

/**
 * Cloudflare Turnstile のウィジェットを送信操作の直前に実行し、token を取得する。
 * `containerRef` を送信対象の UI がマウントされ続ける位置に描画しておく必要がある
 * (画面遷移でアンマウントされると widget も失われる)。
 * `siteKey` は Server Component が実行時に読んだ `TURNSTILE_SITE_KEY` を props
 * 経由で渡す想定(NEXT_PUBLIC_ 化してビルド時に固定しないため)。未設定の環境
 * (backend の TURNSTILE_ENABLED=false に対応) では getToken は空文字列を返し、
 * ウィジェットも描画しない。
 */
export const useTurnstileToken = (
  action: string,
  siteKey: string | undefined
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  const pendingRef = useRef<PendingToken | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!siteKey || !container) return;

    let widgetId: string | null = null;
    let cancelled = false;

    readyRef.current = loadTurnstile().then((turnstile) => {
      if (cancelled) return;

      widgetId = turnstile.render(container, {
        sitekey: siteKey,
        action,
        execution: 'execute',
        appearance: 'interaction-only',
        callback: (token) => {
          pendingRef.current?.resolve(token);
          pendingRef.current = null;
        },
        // Cloudflare Turnstile API が要求するキー名そのまま。
        /* eslint-disable @typescript-eslint/naming-convention */
        'error-callback': () => {
          pendingRef.current?.reject(
            new Error('Turnstile verification failed')
          );
          pendingRef.current = null;
        },
        'expired-callback': () => {
          pendingRef.current?.reject(new Error('Turnstile token expired'));
          pendingRef.current = null;
        },
        'timeout-callback': () => {
          pendingRef.current?.reject(
            new Error('Turnstile challenge timed out')
          );
          pendingRef.current = null;
        },
        /* eslint-enable @typescript-eslint/naming-convention */
      });
      widgetIdRef.current = widgetId;
    });

    return () => {
      cancelled = true;
      if (widgetId) {
        window.turnstile?.remove(widgetId);
      }
      widgetIdRef.current = null;
      readyRef.current = null;
    };
  }, [action, siteKey]);

  const getToken = useCallback(async (): Promise<string> => {
    if (!siteKey) return '';

    await readyRef.current;

    const container = containerRef.current;
    const widgetId = widgetIdRef.current;
    if (!container || !widgetId) {
      throw new Error('Turnstile widget is not ready');
    }

    return new Promise<string>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      const turnstile = window.turnstile;
      if (!turnstile) {
        pendingRef.current = null;
        reject(new Error('Turnstile is unavailable'));
        return;
      }
      turnstile.reset(widgetId);
      turnstile.execute(container);
    });
  }, [siteKey]);

  return { containerRef, getToken };
};
