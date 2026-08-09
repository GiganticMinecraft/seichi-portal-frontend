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
  'error-callback': () => void;
  'expired-callback': () => void;
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (container: HTMLElement) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

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
  loadPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    Object.assign(window, {
      [ONLOAD_CALLBACK_NAME]: () => {
        if (!window.turnstile) {
          reject(new Error('Turnstile script loaded without window.turnstile'));
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
      reject(new Error('Failed to load Turnstile script'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};
