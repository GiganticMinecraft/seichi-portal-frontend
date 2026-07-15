'use client';

import { useCallback, useEffect, useRef } from 'react';

import {
  createSingleFlightLock,
  runSingleFlight,
} from '@/generic/singleFlight';

/**
 * 送信系の action 関数を多重実行不可にして返す。
 * ボタンの disabled 忘れやキー連打によるレースがあっても、
 * 実行中は新しい呼び出しを行わず進行中の Promise を返すため、
 * 呼び出し側（UI）の実装漏れが多重送信に直結しない。
 *
 * 返す関数の参照は安定させ、呼び出し側の useEffect / useCallback の
 * 依存配列に入れても再レンダーの原因にならないようにする。
 * ref への書き込みは render 中に行わず useEffect 側で行う
 * （react-hooks/refs: ref は render 中に読み書きしない）。
 */
export const useSingleFlightAction = <Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
): ((...args: Args) => Promise<R>) => {
  const lockRef = useRef(createSingleFlightLock<R>());
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  return useCallback(
    (...args: Args) =>
      runSingleFlight(lockRef.current, actionRef.current, ...args),
    []
  );
};
