import userEvent from '@testing-library/user-event';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useTurnstileToken } from '@/hooks/useTurnstileToken';

import { render, screen, waitFor } from './render';

type TurnstileRenderOptions = Record<string, unknown>;

const isCallback = (value: unknown): value is () => void =>
  typeof value === 'function';

const isTokenCallback = (value: unknown): value is (token: string) => void =>
  typeof value === 'function';

const isErrorCallback = (
  value: unknown
): value is (errorCode: unknown) => boolean => typeof value === 'function';

const turnstileMocks = vi.hoisted(() => ({
  loadTurnstile: vi.fn(),
  render: vi.fn(),
  reset: vi.fn(),
  execute: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('@/lib/turnstile', () => ({
  loadTurnstile: turnstileMocks.loadTurnstile,
  TurnstileError: class TurnstileError extends Error {
    readonly code: string | undefined;

    constructor(message: string, code?: unknown) {
      super(message);
      this.name = 'TurnstileError';
      this.code =
        typeof code === 'string' || typeof code === 'number'
          ? String(code)
          : undefined;
    }
  },
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

// 認証リダイレクトから戻った直後、passive effect より先にログイン処理が
// 再開する状況を再現する。
const ImmediateTokenHarness = ({
  onToken,
}: {
  onToken: (token: Promise<string>) => void;
}) => {
  const startedRef = useRef(false);
  const { containerRef, getToken } = useTurnstileToken(
    'session-create',
    'site-key'
  );

  useLayoutEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const token = getToken();
    void token.catch(() => {});
    onToken(token);
  }, [getToken, onToken]);

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

  it('widget の effect より先に getToken が呼ばれても初期化完了を待つ', async () => {
    let tokenCallback: ((token: string) => void) | undefined;
    const turnstile = {
      render: turnstileMocks.render.mockImplementation(
        (_container: HTMLElement, options: TurnstileRenderOptions) => {
          const callback = Reflect.get(options, 'callback');
          tokenCallback = isTokenCallback(callback) ? callback : undefined;
          return 'widget-id';
        }
      ),
      reset: turnstileMocks.reset,
      execute: turnstileMocks.execute,
      remove: turnstileMocks.remove,
    };
    window.turnstile = turnstile;
    turnstileMocks.loadTurnstile.mockResolvedValue(turnstile);
    const onToken = vi.fn<(token: Promise<string>) => void>();

    render(<ImmediateTokenHarness onToken={onToken} />);

    await waitFor(() => {
      expect(turnstileMocks.render).toHaveBeenCalledOnce();
      expect(turnstileMocks.execute).toHaveBeenCalledWith(
        screen.getByTestId('turnstile-container')
      );
    });

    if (!tokenCallback) {
      throw new Error('callback が登録されていません');
    }
    tokenCallback('test-token');

    const tokenPromise = onToken.mock.calls[0]?.[0];
    if (!tokenPromise) {
      throw new Error('getToken が呼ばれていません');
    }
    await expect(tokenPromise).resolves.toBe('test-token');
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

  it('Turnstile のエラーコードを保持してトークン取得を終了できる', async () => {
    let errorCallback: ((errorCode: unknown) => boolean) | undefined;
    const turnstile = {
      render: turnstileMocks.render.mockImplementation(
        (_container: HTMLElement, options: TurnstileRenderOptions) => {
          const callback = Reflect.get(options, 'error-callback');
          errorCallback = isErrorCallback(callback) ? callback : undefined;
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
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(<TestHarness onReady={onReady} />);

    await waitFor(() => {
      expect(turnstileMocks.render).toHaveBeenCalled();
    });

    const getToken = onReady.mock.lastCall?.[0];
    if (!getToken || !errorCallback) {
      throw new Error('Turnstile が初期化されていません');
    }

    const tokenPromise = getToken();
    await waitFor(() => {
      expect(turnstileMocks.execute).toHaveBeenCalled();
    });

    errorCallback('200500');

    await expect(tokenPromise).rejects.toMatchObject({
      name: 'TurnstileError',
      code: '200500',
    });
    expect(consoleError).toHaveBeenCalledWith(
      '[Turnstile] widget error',
      expect.objectContaining({ code: '200500' })
    );
  });

  it('Turnstile の初期化失敗を呼び出し元へ返し、診断ログを残せる', async () => {
    const loadError = new Error('Failed to load Turnstile script');
    turnstileMocks.loadTurnstile.mockRejectedValue(loadError);
    const onReady = vi.fn<(getToken: () => Promise<string>) => void>();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(<TestHarness onReady={onReady} />);

    await waitFor(() => {
      expect(turnstileMocks.loadTurnstile).toHaveBeenCalled();
    });

    const getToken = onReady.mock.lastCall?.[0];
    if (!getToken) {
      throw new Error('getToken が初期化されていません');
    }

    await expect(getToken()).rejects.toBe(loadError);
    expect(consoleError).toHaveBeenCalledWith(
      '[Turnstile] widget initialization failed',
      loadError
    );
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
