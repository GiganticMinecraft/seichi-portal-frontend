import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLatestWinsAction } from '@/hooks/useLatestWinsAction';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useLatestWinsAction', () => {
  it('実行中は pending が true になり、キューが空になった時点で false へ戻る', async () => {
    const first = deferred<string>();
    const action = vi
      .fn<(value: string) => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce('done:c');
    const { result } = renderHook(() => useLatestWinsAction(action));

    expect(result.current.pending).toBe(false);

    let runA!: Promise<string>;
    let runC!: Promise<string>;
    act(() => {
      runA = result.current.run('a');
      void result.current.run('b').catch(() => {
        // 'b' は latest-wins によって実行されず、共有先の 'c' の結果を
        // そのまま受け取る想定。ここでの reject 有無は別テストの関心事。
      });
      runC = result.current.run('c');
    });

    expect(result.current.pending).toBe(true);
    // b は実行されず、実行中の a と、a の後に自動実行される c の2回だけ
    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith('a');

    first.resolve('done:a');
    await act(async () => {
      await runA;
      await runC;
    });

    expect(action).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenNthCalledWith(2, 'c');
    expect(result.current.pending).toBe(false);
  });
});
