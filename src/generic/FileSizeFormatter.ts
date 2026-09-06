const UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** バイト数を人が読みやすい単位付き文字列にする(例: 1536 -> "1.5 KB")。 */
export const formatFileSize = (bytes: number): string => {
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${UNITS[unitIndex]}`;
};
