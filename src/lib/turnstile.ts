// Cloudflare Turnstile のブラウザ API 型定義とスクリプトローダー。
// `execution: 'execute'` で描画時は待機させ、送信操作の直前に token を取得する。

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  execution: 'execute';
  appearance: 'interaction-only';
  callback: (token: string) => void;
  // Cloudflare Turnstile API が要求するキー名そのまま。
  /* eslint-disable @typescript-eslint/naming-convention */
  'error-callback': (errorCode: unknown) => boolean;
  'expired-callback': () => boolean;
  'timeout-callback': () => boolean;
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (container: HTMLElement) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

const normalizeErrorCode = (value: unknown): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return undefined;
};

export class TurnstileError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: unknown) {
    const normalizedCode = normalizeErrorCode(code);
    super(
      normalizedCode ? `${message} (error code: ${normalizedCode})` : message
    );
    this.name = 'TurnstileError';
    this.code = normalizedCode;
  }
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const ONLOAD_CALLBACK_NAME = '__seichiPortalTurnstileOnload';

let loadPromise: Promise<TurnstileApi> | null = null;

// script タグの挿入と onload 待ちを一度だけ行う（呼び出し元が複数あっても共有する）。
export const loadTurnstile = (): Promise<TurnstileApi> => {
  if (loadPromise) return loadPromise;

  const promise = new Promise<TurnstileApi>((resolve, reject) => {
    Object.assign(window, {
      [ONLOAD_CALLBACK_NAME]: () => {
        if (!window.turnstile) {
          reject(
            new TurnstileError(
              'Turnstile script loaded without window.turnstile',
              'api-missing'
            )
          );
          return;
        }
        resolve(window.turnstile);
      },
    });

    const script = document.createElement('script');
    script.src = `${SCRIPT_SRC}?onload=${ONLOAD_CALLBACK_NAME}&render=explicit`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      script.remove();
      reject(
        new TurnstileError('Failed to load Turnstile script', 'script-load')
      );
    };
    document.head.appendChild(script);
  });

  loadPromise = promise;

  // 呼び出し側が await する前に script.onerror が発生しても unhandled rejection
  // にせず、次回の呼び出しでは再試行できるようにする。
  void promise.catch(() => {
    if (loadPromise === promise) {
      loadPromise = null;
    }
  });

  return promise;
};
