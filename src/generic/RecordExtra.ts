/**
 * ex:
 *  const record = {
 *   a: 'a',
 *   b: undefined,
 *   c: null,
 *   d: 'd',
 *  };
 *
 *  const cleanedRecords = removeUndefinedOrNullRecords(record);
 *  console.log(cleanedRecords); // -> { a: 'a', d: 'd' }
 *
 *
 * @returns Record の value が undefined または null の場合を、その key / value を削除したもの
 */
export function removeUndefinedOrNullRecords<T>(
  record: Record<string, T>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => value !== undefined && value !== null
    )
  ) as { [k: string]: string };
}
