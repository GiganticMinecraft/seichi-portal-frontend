export function removeDuplicates<T>(array: T[]): T[] {
  // NOTE: TypeScript の Set 型は順番を維持する
  //  ref: https://zenn.dev/notfounds/scraps/d8a0e4b99ddc38
  return Array.from(new Set(array));
}
