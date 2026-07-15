export type QueueSlot<Args extends unknown[], R> = {
  args: Args;
  resolve: (value: R) => void;
  reject: (reason: unknown) => void;
};

type Batch<Args extends unknown[], R> = {
  all: QueueSlot<Args, R>[];
  latest: QueueSlot<Args, R>;
};

export type LatestWinsState<Args extends unknown[], R> = {
  batch: Batch<Args, R> | null;
  running: boolean;
};

export const createLatestWinsState = <
  Args extends unknown[],
  R,
>(): LatestWinsState<Args, R> => ({
  batch: null,
  running: false,
});

/**
 * 呼び出しを1つも取りこぼさずに直列実行する。届いた時点で実行中でなければ
 * その呼び出し自身の引数で即座に単独実行される。既に実行中のときに届いた
 * 呼び出しは次の枠にまとめて積まれ、実行完了直後にその時点で最新だった
 * 引数だけで自動的に再実行される（同じ枠に積まれた、より古い引数の呼び出し
 * は実際には実行されない）。
 *
 * 実行されなかった呼び出しの Promise も、自分が乗っていた枠が実際に実行
 * された結果（成功/失敗）をそのまま共有するため、呼び出し側は自分の呼び出し
 * が実際に送信されたかどうかを気にせず扱える。
 *
 * onSettle はキューが空になり実行が完全に止まったときに1回だけ呼ばれる
 * （pending 表示など、実行中かどうかを外部に伝えるための通知用）。
 *
 * fn は idle から running への遷移を起こした呼び出し（キューが空の状態で
 * 呼ばれた最初の呼び出し）でのみ使われ、以降 drain し続ける間はその fn が
 * 使い回される。実行中に追加で enqueueLatestWins を呼んだときに渡した fn は
 * 無視される（args だけが使われる）。呼び出しごとに fn の実体が変わりうる
 * 場合は、常に最新の対象を読みに行く薄いラッパー（ref 経由など）を渡すこと。
 */
export const enqueueLatestWins = <Args extends unknown[], R>(
  state: LatestWinsState<Args, R>,
  fn: (...args: Args) => Promise<R>,
  args: Args,
  onSettle: () => void
): Promise<R> =>
  new Promise<R>((resolve, reject) => {
    const slot: QueueSlot<Args, R> = { args, resolve, reject };
    state.batch = state.batch
      ? { all: [...state.batch.all, slot], latest: slot }
      : { all: [slot], latest: slot };

    if (!state.running) {
      state.running = true;
      void drain(state, fn, onSettle);
    }
  });

const drain = async <Args extends unknown[], R>(
  state: LatestWinsState<Args, R>,
  fn: (...args: Args) => Promise<R>,
  onSettle: () => void
): Promise<void> => {
  while (state.batch) {
    const { all, latest } = state.batch;
    state.batch = null;
    try {
      const result = await fn(...latest.args);
      all.forEach((slot) => {
        slot.resolve(result);
      });
    } catch (error) {
      all.forEach((slot) => {
        slot.reject(error);
      });
    }
  }
  state.running = false;
  onSettle();
};
