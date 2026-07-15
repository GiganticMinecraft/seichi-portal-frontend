import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePendingAction } from '@/hooks/usePendingAction';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('usePendingAction', () => {
  it('実行中は pending が true になり、完了後に false へ戻る', async () => {
    const { promise, resolve } = deferred<string>();
    const action = vi.fn(() => promise);
    const { result } = renderHook(() => usePendingAction(action));

    expect(result.current.pending).toBe(false);

    let runPromise!: Promise<string>;
    act(() => {
      runPromise = result.current.run();
    });

    expect(result.current.pending).toBe(true);

    resolve('done');
    await act(async () => {
      await runPromise;
    });

    expect(result.current.pending).toBe(false);
  });

  it('失敗した場合も pending は false に戻る', async () => {
    const { promise, reject } = deferred<string>();
    const action = vi.fn(() => promise);
    const { result } = renderHook(() => usePendingAction(action));

    let runPromise!: Promise<string | undefined>;
    act(() => {
      runPromise = result.current.run().catch(() => {
        // pending が false に戻ることを確認したいだけなので、
        // ここでの reject 自体はテスト失敗として扱わない。
        return undefined;
      });
    });

    expect(result.current.pending).toBe(true);

    reject(new Error('failed'));
    await act(async () => {
      await runPromise;
    });

    expect(result.current.pending).toBe(false);
  });

  it('実行中に再度 run を呼んでも、実処理は1回しか走らない', async () => {
    const { promise, resolve } = deferred<string>();
    const action = vi.fn(() => promise);
    const { result } = renderHook(() => usePendingAction(action));

    let first!: Promise<string>;
    let second!: Promise<string>;
    act(() => {
      first = result.current.run();
      second = result.current.run();
    });

    expect(action).toHaveBeenCalledTimes(1);

    resolve('done');
    await act(async () => {
      await Promise.all([first, second]);
    });

    expect(action).toHaveBeenCalledTimes(1);
  });
});
