import { describe, expect, it } from 'vitest';
import {
  formatRestrictionExpiration,
  toRestrictionExpiration,
} from '@/lib/restrictions/expiration';

describe('restriction expiration', () => {
  it('API の nullable な解除予定を制限期限 model に変換する', () => {
    expect(toRestrictionExpiration(null)).toEqual({ kind: 'indefinite' });
    expect(toRestrictionExpiration(undefined)).toEqual({ kind: 'indefinite' });
    expect(toRestrictionExpiration('2026-07-01T12:34:00+09:00')).toEqual({
      kind: 'expiresAt',
      expiresAt: '2026-07-01T12:34:00+09:00',
    });
  });

  it('制限期限 model から表示文字列を作る', () => {
    expect(formatRestrictionExpiration({ kind: 'indefinite' })).toBe('無期限');
    expect(
      formatRestrictionExpiration({
        kind: 'expiresAt',
        expiresAt: '2026-07-01T12:34:00+09:00',
      })
    ).toBe('2026年07月01日 12時34分');
  });
});
