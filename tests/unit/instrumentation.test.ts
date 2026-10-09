import { afterEach, describe, expect, it, vi } from 'vitest';

// native モジュールのロードをテストで避けるため必ず mock する
vi.mock('@pyroscope/nodejs', () => ({
  init: vi.fn(() => {
    throw new Error('boom: native module failed to load');
  }),
  start: vi.fn(),
}));

const importStartPyroscope = async () => {
  // 環境変数の評価はモジュール読み込み後の呼び出し時に行われる
  const { startPyroscope } = await import('@/instrumentation');
  return startPyroscope;
};

describe('startPyroscope', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('プロファイラの初期化が throw してもサーバー起動を止めない (エラーログのみ)', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'nodejs');
    vi.stubEnv('PYROSCOPE_SERVER_ADDRESS', 'http://pyroscope:4040');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const startPyroscope = await importStartPyroscope();

    // Next.js は register() 内の例外を再 throw してサーバーを起動不能にするため、
    // reject しないことがこの関数の契約
    await expect(startPyroscope()).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError.mock.calls[0]?.[0]).toContain(
      'failed to start pyroscope profiler'
    );
  });

  it('PYROSCOPE_SERVER_ADDRESS 未設定なら何もしない', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'nodejs');
    vi.stubEnv('PYROSCOPE_SERVER_ADDRESS', '');
    const pyroscope = await import('@pyroscope/nodejs');

    const startPyroscope = await importStartPyroscope();
    await startPyroscope();

    expect(pyroscope.init).not.toHaveBeenCalled();
  });

  it('Node.js ランタイム以外では何もしない', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'edge');
    vi.stubEnv('PYROSCOPE_SERVER_ADDRESS', 'http://pyroscope:4040');
    const pyroscope = await import('@pyroscope/nodejs');

    const startPyroscope = await importStartPyroscope();
    await startPyroscope();

    expect(pyroscope.init).not.toHaveBeenCalled();
  });
});

describe('nodeMetricsConfiguration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('Node.js ランタイムでは OTLP の metric reader とランタイム計装を設定する', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'nodejs');
    const { nodeMetricsConfiguration } = await import('@/instrumentation');
    const { PeriodicExportingMetricReader } =
      await import('@opentelemetry/sdk-metrics');
    const { RuntimeNodeInstrumentation } =
      await import('@opentelemetry/instrumentation-runtime-node');

    const configuration = await nodeMetricsConfiguration();

    expect(configuration.metricReaders).toHaveLength(1);
    expect(configuration.metricReaders?.[0]).toBeInstanceOf(
      PeriodicExportingMetricReader
    );
    // 既定の fetch 計装 ('auto') を残したままランタイム計装を足す
    expect(configuration.instrumentations?.[0]).toBe('auto');
    expect(configuration.instrumentations?.[1]).toBeInstanceOf(
      RuntimeNodeInstrumentation
    );
  });

  it('Node.js ランタイム以外では何も設定しない', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'edge');
    const { nodeMetricsConfiguration } = await import('@/instrumentation');

    await expect(nodeMetricsConfiguration()).resolves.toEqual({});
  });
});
