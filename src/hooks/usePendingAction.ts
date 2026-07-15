'use client';

import { useCallback, useState } from 'react';

import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';

/**
 * 非同期 action をラップし、実行中かどうかを表す pending state を提供する。
 * 内部で useSingleFlightAction を使うため、実行中の再呼び出しは新規実行にならない。
 *
 * 呼び出しごとに引数が変わりうる action（例: 連続して異なる値を選択できる Select）
 * に使う場合、実行中の再呼び出しは「先に受け付けた呼び出しの結果」を返すだけで、
 * 後から渡した引数は送信されない。呼び出し側で pending 中は操作自体をできなくする
 * こと（disabled 等）を必ず併用し、この仕組みだけに正しさを委ねないこと。
 */
export const usePendingAction = <Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
): { run: (...args: Args) => Promise<R>; pending: boolean } => {
  const [pending, setPending] = useState(false);
  const guarded = useSingleFlightAction(action);

  const run = useCallback(
    async (...args: Args): Promise<R> => {
      setPending(true);
      try {
        return await guarded(...args);
      } finally {
        setPending(false);
      }
    },
    [guarded]
  );

  return { run, pending };
};
