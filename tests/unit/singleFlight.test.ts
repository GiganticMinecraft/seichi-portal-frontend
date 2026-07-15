import { describe, expect, it, vi } from 'vitest';

import {
  createSingleFlightLock,
  runSingleFlight,
} from '@/generic/singleFlight';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('runSingleFlight', () => {
  it('実行中に重ねて呼んでも、実処理は1回しか走らず同じ結果を共有する', async () => {
    const { promise, resolve } = deferred<string>();
    const fn = vi.fn(() => promise);
    const lock = createSingleFlightLock<string>();

    const first = runSingleFlight(lock, fn);
    const second = runSingleFlight(lock, fn);

    expect(fn).toHaveBeenCalledTimes(1);

    resolve('done');

    await expect(first).resolves.toBe('done');
    await expect(second).resolves.toBe('done');
  });

  it('完了後に呼ぶと新しい実行として扱われる', async () => {
    const fn = vi.fn(() => Promise.resolve('ok'));
    const lock = createSingleFlightLock<string>();

    await runSingleFlight(lock, fn);
    await runSingleFlight(lock, fn);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('失敗した場合もロックが解除され、次の呼び出しは新規実行になる', async () => {
    const lock = createSingleFlightLock<string>();
    const failing = vi.fn(() => Promise.reject(new Error('failed')));

    await expect(runSingleFlight(lock, failing)).rejects.toThrow('failed');

    const succeeding = vi.fn(() => Promise.resolve('ok'));
    await expect(runSingleFlight(lock, succeeding)).resolves.toBe('ok');
    expect(succeeding).toHaveBeenCalledTimes(1);
  });
});
