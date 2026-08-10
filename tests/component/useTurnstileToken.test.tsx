import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useTurnstileToken } from '@/hooks/useTurnstileToken';

import { render, screen, waitFor } from './render';

type TurnstileRenderOptions = Record<string, unknown>;

const isCallback = (value: unknown): value is () => void =>
  typeof value === 'function';

const isTokenCallback = (value: unknown): value is (token: string) => void =>
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

// 送信成功でコンテナが消え、「別の回答をする」で再度マウントされる状況を再現する。
const RemountHarness = ({
  onReady,
}: {
  onReady: (getToken: () => Promise<string>) => void;
}) => {
  const [visible, setVisible] = useState(true);
  const { containerRef, getToken } = useTurnstileToken(
    'temporary-answer',
    'site-key'
  );

  useEffect(() => {
    onReady(getToken);
  }, [getToken, onReady]);

  return (
    <div>
      <button
        onClick={() => {
          setVisible((v) => !v);
        }}
      >
        toggle
      </button>
      {visible && <div ref={containerRef} data-testid="turnstile-container" />}
    </div>
  );
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

  it('コンテナが作り直されても widget を再生成し、2回目の getToken が動作する', async () => {
    let renderCount = 0;
    let latestCallback: ((token: string) => void) | undefined;
    const turnstile = {
      render: turnstileMocks.render.mockImplementation(
        (_container: HTMLElement, options: TurnstileRenderOptions) => {
          renderCount += 1;
          const callback = Reflect.get(options, 'callback');
          latestCallback = isTokenCallback(callback) ? callback : undefined;
          return `widget-id-${renderCount}`;
        }
      ),
      reset: turnstileMocks.reset,
      execute: turnstileMocks.execute,
      remove: turnstileMocks.remove,
    };
    window.turnstile = turnstile;
    turnstileMocks.loadTurnstile.mockResolvedValue(turnstile);
    const onReady = vi.fn<(getToken: () => Promise<string>) => void>();
    const user = userEvent.setup();

    render(<RemountHarness onReady={onReady} />);

    await waitFor(() => {
      expect(turnstileMocks.render).toHaveBeenCalledTimes(1);
    });

    // 送信成功でコンテナがアンマウントされる場面を模す。
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    await waitFor(() => {
      expect(turnstileMocks.remove).toHaveBeenCalledWith('widget-id-1');
    });

    // 「別の回答をする」で再びコンテナがマウントされる場面を模す。
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    await waitFor(() => {
      expect(turnstileMocks.render).toHaveBeenCalledTimes(2);
    });

    const getToken = onReady.mock.lastCall?.[0];
    if (!getToken) {
      throw new Error('Turnstile が初期化されていません');
    }

    const tokenPromise = getToken();
    await waitFor(() => {
      expect(turnstileMocks.reset).toHaveBeenCalledWith('widget-id-2');
      expect(turnstileMocks.execute).toHaveBeenCalledWith(
        screen.getByTestId('turnstile-container')
      );
    });

    if (!latestCallback) {
      throw new Error('callback が登録されていません');
    }
    latestCallback('test-token');

    await expect(tokenPromise).resolves.toBe('test-token');
  });
});
