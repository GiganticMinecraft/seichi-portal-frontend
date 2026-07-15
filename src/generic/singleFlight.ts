export type SingleFlightLock<R> = { current: Promise<R> | null };

export const createSingleFlightLock = <R>(): SingleFlightLock<R> => ({
  current: null,
});

/**
 * lock が実行中を示している間は、新しい呼び出しを行わず進行中の Promise を返す。
 * 同じ処理が UI 側の複数の入り口（クリック・Enter キー連打など）から
 * 同時に呼ばれても、実行は常に1つに保たれる。
 */
export const runSingleFlight = <Args extends unknown[], R>(
  lock: SingleFlightLock<R>,
  fn: (...args: Args) => Promise<R>,
  ...args: Args
): Promise<R> => {
  if (lock.current) {
    return lock.current;
  }

  const promise = fn(...args).finally(() => {
    lock.current = null;
  });
  lock.current = promise;
  return promise;
};
