import { describe, expect, it } from 'vitest';

import {
  getRateLimitResetSeconds,
  getRetryAfterSeconds,
  HttpError,
} from '@/lib/httpError';

describe('HTTP rate-limit metadata', () => {
  it('keeps problem details and normalizes numeric delta headers', () => {
    const headers = new Headers({
      'Retry-After': '3',
      'RateLimit-Reset': '7',
    });
    const error = new HttpError({
      message: 'rate limited',
      status: 429,
      url: '/forms',
      body: { errorCode: 'RATE_LIMIT_EXCEEDED', detail: 'try later' },
      headers,
    });

    expect(error.status).toBe(429);
    expect(error.errorCode).toBe('RATE_LIMIT_EXCEEDED');
    expect(error.detail).toBe('try later');
    expect(error.retryAfter).toBe(3);
    expect(error.rateLimitReset).toBe(7);
  });

  it('ignores invalid delta values without losing the response status', () => {
    const headers = new Headers({
      'Retry-After': 'tomorrow',
      'RateLimit-Reset': '1700000000',
    });
    const error = new HttpError({
      message: 'rate limited',
      status: 429,
      url: '/forms',
      headers,
    });

    expect(error.status).toBe(429);
    expect(getRetryAfterSeconds(headers)).toBeUndefined();
    expect(getRateLimitResetSeconds(headers)).toBe(1700000000);
  });
});
