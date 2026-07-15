'use client';

import { useRef } from 'react';

import {
  createSingleFlightLock,
  runSingleFlight,
} from '@/generic/singleFlight';

/**
 * 送信系の action 関数を多重実行不可にして返す。
 * ボタンの disabled 忘れやキー連打によるレースがあっても、
 * 実行中は新しい呼び出しを行わず進行中の Promise を返すため、
 * 呼び出し側（UI）の実装漏れが多重送信に直結しない。
 */
export const useSingleFlightAction = <Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
): ((...args: Args) => Promise<R>) => {
  const lockRef = useRef(createSingleFlightLock<R>());

  return (...args: Args) => runSingleFlight(lockRef.current, action, ...args);
};
