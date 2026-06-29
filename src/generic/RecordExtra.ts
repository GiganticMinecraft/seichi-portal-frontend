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
): Record<string, NonNullable<T>> {
  return Object.fromEntries(
    Object.entries(record).filter(
      (entry): entry is [string, NonNullable<T>] =>
        entry[1] !== undefined && entry[1] !== null
    )
  );
}
