import { describe, expect, it } from 'vitest';
import {
  formatResponsePeriod,
  toResponsePeriod,
} from '@/lib/forms/responsePeriod';

describe('toResponsePeriod', () => {
  it('API の未設定状態を画面用 model の none に変換する', () => {
    expect(toResponsePeriod(null)).toEqual({ kind: 'none' });
    expect(toResponsePeriod(undefined)).toEqual({ kind: 'none' });
    expect(toResponsePeriod({ start_at: null, end_at: null })).toEqual({
      kind: 'none',
    });
  });

  it('開始日時のみの回答期間を区別する', () => {
    expect(
      toResponsePeriod({
        start_at: '2026-06-01T10:00:00+09:00',
        end_at: null,
      })
    ).toEqual({
      kind: 'startsAt',
      startAt: '2026-06-01T10:00:00+09:00',
    });
  });

  it('終了日時のみの回答期間を区別する', () => {
    expect(
      toResponsePeriod({
        start_at: null,
        end_at: '2026-06-30T23:59:00+09:00',
      })
    ).toEqual({
      kind: 'endsAt',
      endAt: '2026-06-30T23:59:00+09:00',
    });
  });

  it('開始日時と終了日時がある回答期間を区別する', () => {
    expect(
      toResponsePeriod({
        start_at: '2026-06-01T10:00:00+09:00',
        end_at: '2026-06-30T23:59:00+09:00',
      })
    ).toEqual({
      kind: 'specified',
      startAt: '2026-06-01T10:00:00+09:00',
      endAt: '2026-06-30T23:59:00+09:00',
    });
  });
});

describe('formatResponsePeriod', () => {
  it('画面用 model から回答期間の表示文字列を作る', () => {
    expect(formatResponsePeriod({ kind: 'none' })).toBe('回答期限なし');
    expect(
      formatResponsePeriod({
        kind: 'startsAt',
        startAt: '2026-06-01T10:00:00+09:00',
      })
    ).toBe('2026年06月01日 10時00分 ~');
    expect(
      formatResponsePeriod({
        kind: 'endsAt',
        endAt: '2026-06-30T23:59:00+09:00',
      })
    ).toBe('~ 2026年06月30日 23時59分');
    expect(
      formatResponsePeriod({
        kind: 'specified',
        startAt: '2026-06-01T10:00:00+09:00',
        endAt: '2026-06-30T23:59:00+09:00',
      })
    ).toBe('2026年06月01日 10時00分 ~ 2026年06月30日 23時59分');
  });
});
