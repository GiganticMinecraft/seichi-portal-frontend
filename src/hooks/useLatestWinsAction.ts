'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createLatestWinsState,
  enqueueLatestWins,
} from '@/generic/latestWinsQueue';

/**
 * useSingleFlightAction / usePendingAction は「実行中の再呼び出しは黙って
 * 最初の呼び出しの結果を共有する」ため、呼び出しごとに引数が変わりうる
 * action（例: 連続して異なる値を選べる Select）に使うと、後から渡した
 * 引数がサーバーへ送信されないまま握りつぶされる。
 *
 * このフックは代わりに、届いた呼び出しを1つも取りこぼさずに直列実行する
 * （詳細な契約は src/generic/latestWinsQueue.ts を参照）。呼び出しごとに
 * 引数が変わりうる action にはこちらを使う。
 */
export const useLatestWinsAction = <Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
): { run: (...args: Args) => Promise<R>; pending: boolean } => {
  const [pending, setPending] = useState(false);
  const actionRef = useRef(action);
  const stateRef = useRef(createLatestWinsState<Args, R>());

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const run = useCallback((...args: Args): Promise<R> => {
    setPending(true);
    return enqueueLatestWins(
      stateRef.current,
      (...a: Args) => actionRef.current(...a),
      args,
      () => {
        setPending(false);
      }
    );
  }, []);

  return { run, pending };
};
