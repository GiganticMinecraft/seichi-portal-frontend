import type { BeforeSendHook } from '@grafana/faro-web-sdk';

const HTTP_URL_PATTERN = /https?:\/\/[^\s"'<>]+/g;
const TRAILING_PUNCTUATION_PATTERN = /[),.;\]}]+$/;

const sanitizeAbsoluteUrl = (rawUrl: string): string => {
  const trailingPunctuation =
    rawUrl.match(TRAILING_PUNCTUATION_PATTERN)?.[0] ?? '';
  const candidate =
    trailingPunctuation && /[?#]/.test(rawUrl)
      ? rawUrl.slice(0, -trailingPunctuation.length)
      : rawUrl;

  try {
    const url = new URL(candidate);
    if (!url.search && !url.hash) return rawUrl;

    url.search = '';
    url.hash = '';
    return `${url.toString()}${trailingPunctuation}`;
  } catch {
    return rawUrl;
  }
};

export const sanitizeUrlsInText = (value: string): string =>
  value.replace(HTTP_URL_PATTERN, sanitizeAbsoluteUrl);

const isPlainRecord = (value: object): value is Record<string, unknown> => {
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const isUnknownArray = (value: object): value is unknown[] =>
  Array.isArray(value);

export const sanitizeTelemetryValue = (
  value: unknown,
  seen = new WeakSet<object>()
): void => {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value);

  if (isUnknownArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const item = value[index];
      if (typeof item === 'string') {
        value[index] = sanitizeUrlsInText(item);
      } else {
        sanitizeTelemetryValue(item, seen);
      }
    }
    return;
  }

  if (!isPlainRecord(value)) return;

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string') {
      value[key] = sanitizeUrlsInText(item);
    } else {
      sanitizeTelemetryValue(item, seen);
    }
  }
};

/**
 * Faro が収集した URL から query と fragment を送信直前に除去する。
 * OAuth の認可コードなどが page metadata、event attributes、trace、stacktrace の
 * どこに含まれても漏れないよう、JSON互換の transport item 全体を処理する。
 */
export const sanitizeTelemetryItem: BeforeSendHook = (item) => {
  sanitizeTelemetryValue(item);
  return item;
};
