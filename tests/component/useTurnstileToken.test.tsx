import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useTurnstileToken } from '@/hooks/useTurnstileToken';

import { render, screen, waitFor } from './render';

type TurnstileRenderOptions = Record<string, unknown>;

const isCallback = (value: unknown): value is () => void =>
  typeof value === 'function';

const turnstileMocks = vi.hoisted(() => ({
  loadTurnstile: vi.fn(),
  render: vi.fn(),
  reset: vi.fn(),
  execute: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('@/lib/turnstile', () => ({
  loadTurnstile: turnstileMocks.loadTurnstile,
}));

const TestHarness = ({
  onReady,
}: {
  onReady: (getToken: () => Promise<string>) => void;
}) => {
  const { containerRef, getToken } = useTurnstileToken(
    'temporary-answer',
    'site-key'
  );

  useEffect(() => {
    onReady(getToken);
  }, [getToken, onReady]);

  return <div ref={containerRef} data-testid="turnstile-container" />;
};

describe('useTurnstileToken', () => {
  afterEach(() => {
    delete window.turnstile;
    vi.clearAllMocks();
  });

  it('対話チャレンジがタイムアウトした場合、トークン取得を終了できる', async () => {
    let timeoutCallback: (() => void) | undefined;
    const turnstile = {
      render: turnstileMocks.render.mockImplementation(
        (_container: HTMLElement, options: TurnstileRenderOptions) => {
          const callback = Reflect.get(options, 'timeout-callback');
          if (!isCallback(callback)) {
            throw new Error('timeout-callback が登録されていません');
          }
          timeoutCallback = callback;
          return 'widget-id';
        }
      ),
      reset: turnstileMocks.reset,
      execute: turnstileMocks.execute,
      remove: turnstileMocks.remove,
    };
    window.turnstile = turnstile;
    turnstileMocks.loadTurnstile.mockResolvedValue(turnstile);
    const onReady = vi.fn<(getToken: () => Promise<string>) => void>();

    render(<TestHarness onReady={onReady} />);

    await waitFor(() => {
      expect(turnstileMocks.render).toHaveBeenCalled();
      expect(screen.getByTestId('turnstile-container')).toBeInTheDocument();
    });

    const getToken = onReady.mock.lastCall?.[0];
    if (!getToken || !timeoutCallback) {
      throw new Error('Turnstile が初期化されていません');
    }

    const tokenPromise = getToken();
    await waitFor(() => {
      expect(turnstileMocks.execute).toHaveBeenCalledWith(
        screen.getByTestId('turnstile-container')
      );
    });

    timeoutCallback();

    await expect(tokenPromise).rejects.toBeInstanceOf(Error);
  });
});
