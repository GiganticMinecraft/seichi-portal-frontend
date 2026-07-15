import { describe, expect, it, vi } from 'vitest';

import {
  createLatestWinsState,
  enqueueLatestWins,
} from '@/generic/latestWinsQueue';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('enqueueLatestWins', () => {
  it('実行中でなければ即座に実行する', async () => {
    const state = createLatestWinsState<[string], string>();
    const fn = vi.fn((value: string) => Promise.resolve(`done:${value}`));
    const onSettle = vi.fn();

    await expect(enqueueLatestWins(state, fn, ['a'], onSettle)).resolves.toBe(
      'done:a'
    );
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
    expect(onSettle).toHaveBeenCalledTimes(1);
  });

  it('実行中に来た呼び出しは実行されず、最新の引数だけが実行完了後に自動実行される', async () => {
    const state = createLatestWinsState<[string], string>();
    const first = deferred<string>();
    const fn = vi
      .fn<(value: string) => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce('done:c');
    const onSettle = vi.fn();

    const runA = enqueueLatestWins(state, fn, ['a'], onSettle);
    const runB = enqueueLatestWins(state, fn, ['b'], onSettle);
    const runC = enqueueLatestWins(state, fn, ['c'], onSettle);

    // a の実行中に b, c が来ても、この時点では c しかキューにない
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    first.resolve('done:a');
    await expect(runA).resolves.toBe('done:a');

    // b は一度も実行されず、最新の c だけが自動的に実行される
    await expect(runB).resolves.toBe('done:c');
    await expect(runC).resolves.toBe('done:c');

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'c');
    // b の引数ではフォームは一切呼ばれていない
    expect(fn).not.toHaveBeenCalledWith('b');
  });

  it('先行する呼び出しの実行中に届いた次の呼び出しは、先行呼び出しの成否に関わらず独立して実行される', async () => {
    // 最初の呼び出しは届いた時点で即座に単独実行が始まるため、2つ目の
    // 呼び出しは「バッチに乗る」余地がなく、次の枠として独立に実行される。
    // バッチとして合流する（=実行されず結果だけ共有する）のは、既に
    // 実行中の枠の"後に"複数の呼び出しが積み重なった場合だけ。
    const state = createLatestWinsState<[string], string>();
    const first = deferred<string>();
    const fn = vi
      .fn<(value: string) => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce('done:b');
    const onSettle = vi.fn();

    const runA = enqueueLatestWins(state, fn, ['a'], onSettle);
    const runB = enqueueLatestWins(state, fn, ['b'], onSettle);

    const error = new Error('failed');
    first.reject(error);

    await expect(runA).rejects.toBe(error);
    await expect(runB).resolves.toBe('done:b');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'b');
  });

  it('同じバッチに乗った呼び出しが失敗すると、乗っていた呼び出し全てが同じ理由で reject される', async () => {
    const state = createLatestWinsState<[string], string>();
    const first = deferred<string>();
    const second = deferred<string>();
    const fn = vi
      .fn<(value: string) => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const onSettle = vi.fn();

    const runA = enqueueLatestWins(state, fn, ['a'], onSettle);
    const runB = enqueueLatestWins(state, fn, ['b'], onSettle);
    const runC = enqueueLatestWins(state, fn, ['c'], onSettle);

    first.resolve('done:a');
    await runA;

    const error = new Error('failed');
    second.reject(error);

    await expect(runB).rejects.toBe(error);
    await expect(runC).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'c');
  });

  it('onSettle はキューが完全に空になったときだけ呼ばれる', async () => {
    const state = createLatestWinsState<[string], string>();
    const first = deferred<string>();
    const fn = vi
      .fn<(value: string) => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce('done:b');
    const onSettle = vi.fn();

    const runA = enqueueLatestWins(state, fn, ['a'], onSettle);
    const runB = enqueueLatestWins(state, fn, ['b'], onSettle);

    first.resolve('done:a');
    await runA;
    await runB;

    // a の完了時点ではまだ b が控えているため onSettle は呼ばれておらず、
    // 完全に空になった b の完了時点で1回だけ呼ばれる
    expect(onSettle).toHaveBeenCalledTimes(1);
  });
});
