import { describe, expect, it } from 'vitest';

import { loadTurnstile } from '@/lib/turnstile';

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/naming-convention */
    __seichiPortalTurnstileOnload?: () => void;
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

describe('loadTurnstile', () => {
  it('script の読み込み失敗後に再試行できる', async () => {
    const firstPromise = loadTurnstile();
    const firstScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );

    if (!firstScript) {
      throw new Error('Turnstile script が挿入されていません');
    }

    firstScript.dispatchEvent(new Event('error'));
    await expect(firstPromise).rejects.toMatchObject({
      name: 'TurnstileError',
      code: 'script-load',
    });

    const secondPromise = loadTurnstile();
    expect(secondPromise).not.toBe(firstPromise);

    const secondScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );
    if (!secondScript) {
      throw new Error('Turnstile script を再挿入できません');
    }

    const turnstile = {
      render: () => 'widget-id',
      execute: () => undefined,
      reset: () => undefined,
      remove: () => undefined,
    };
    window.turnstile = turnstile;
    const onload = window.__seichiPortalTurnstileOnload;
    if (typeof onload !== 'function') {
      throw new Error('Turnstile の onload callback が登録されていません');
    }
    onload();

    await expect(secondPromise).resolves.toBe(turnstile);
    expect(secondScript).toBeInTheDocument();
  });
});
