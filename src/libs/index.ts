/**
 * `start`から始まる`length`個分の数値のジェネレータを生成する。
 * あくまでジェネレータなので、`number`の配列そのものではないことに注意。
 * @param start 範囲の開始値。
 * @param length 範囲の要素数。
 * @example
 * // Console logs like [0, 1, 2, 3, 4]
 * [...rangeIter(0,5)].forEach((v) => console.log(v))
 * @see https://zenn.dev/uhyo/articles/array-n-keys-yamero
 */
export function* rangeIter(start: number, length: number) {
  for (let i = start; i < start + length; i += 1) {
    yield i;
  }
}

export * from './result';
