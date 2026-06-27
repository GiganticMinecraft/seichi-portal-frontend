import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  restrictionFormSchema,
  toRestrictionRequest,
} from '@/app/(protected)/admin/users/_components/restrictionForm';

describe('restrictionFormSchema', () => {
  it('空の理由は弾く', () => {
    const result = restrictionFormSchema.safeParse({
      reason: '   ',
      expiresAt: null,
    });
    expect(result.success).toBe(false);
  });

  it('理由があれば通る', () => {
    const result = restrictionFormSchema.safeParse({
      reason: '不適切な回答のため',
      expiresAt: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('toRestrictionRequest', () => {
  it('expiresAt 未指定なら expires_at を含めない', () => {
    const body = toRestrictionRequest({
      reason: ' 理由 ',
      expiresAt: null,
    });
    expect(body).toEqual({ reason: '理由' });
    expect('expires_at' in body).toBe(false);
  });

  it('expiresAt 指定時は ISO 8601（オフセット付き）で送る', () => {
    const expiresAt = dayjs('2026-07-01T12:34:00+09:00');
    const body = toRestrictionRequest({
      reason: '理由',
      expiresAt,
    });
    expect(body.reason).toBe('理由');
    expect(body.expires_at).toBe(expiresAt.format());
  });
});
