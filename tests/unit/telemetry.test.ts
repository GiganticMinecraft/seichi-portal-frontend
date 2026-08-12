import { describe, expect, it } from 'vitest';

import { sanitizeTelemetryValue, sanitizeUrlsInText } from '@/lib/telemetry';

describe('sanitizeUrlsInText', () => {
  it('URL の query と fragment を除去し、周囲の文章は維持する', () => {
    expect(
      sanitizeUrlsInText(
        'failed at (https://portal.seichi.click/#code=secret&state=value), retry https://example.com/path?q=secret.'
      )
    ).toBe(
      'failed at (https://portal.seichi.click/), retry https://example.com/path.'
    );
  });

  it('query も fragment もない URL は変更しない', () => {
    const value = 'fetch https://portal.seichi.click/forms/123 failed';
    expect(sanitizeUrlsInText(value)).toBe(value);
  });
});

describe('sanitizeTelemetryValue', () => {
  it('meta、event、trace、stacktrace 内の URL を再帰的に処理する', () => {
    const item = {
      meta: {
        page: {
          url: 'https://portal.seichi.click/#code=authorization-code',
        },
      },
      payload: {
        attributes: {
          name: 'https://portal.seichi.click/home?_rsc=secret',
        },
        resourceSpans: [
          {
            attributes: [
              {
                key: 'http.url',
                value: {
                  stringValue:
                    'https://login.microsoftonline.com/token?client-request-id=secret',
                },
              },
            ],
          },
        ],
        stacktrace:
          'Error\n at callback (https://portal.seichi.click/#code=secret:0:0)',
      },
      type: 'event',
    };

    sanitizeTelemetryValue(item);

    expect(item).toEqual({
      meta: { page: { url: 'https://portal.seichi.click/' } },
      payload: {
        attributes: { name: 'https://portal.seichi.click/home' },
        resourceSpans: [
          {
            attributes: [
              {
                key: 'http.url',
                value: {
                  stringValue: 'https://login.microsoftonline.com/token',
                },
              },
            ],
          },
        ],
        stacktrace: 'Error\n at callback (https://portal.seichi.click/)',
      },
      type: 'event',
    });
  });
});
