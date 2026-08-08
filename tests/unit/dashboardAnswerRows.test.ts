import { describe, expect, it } from 'vitest';

import { toDashboardAnswerRows } from '@/app/(protected)/admin/_lib/dashboardAnswerRows';
import type { GetAnswersResponse } from '@/lib/api-types';

const createAnswer = (
  overrides: Partial<GetAnswersResponse[number]>
): GetAnswersResponse[number] => ({
  id: 'answer-id',
  form_id: 'form-id',
  answers: [],
  author: {
    type: 'AUTHENTICATED_USER',
    user: {
      uuid: 'user-id',
      name: 'ユーザー',
      role: 'STANDARD_USER',
    },
  },
  labels: [],
  publication: 'PUBLIC',
  status: 'UNADDRESSED',
  timestamp: '2026-06-01T10:00:00+09:00',
  ...overrides,
});

describe('toDashboardAnswerRows', () => {
  it('回答一覧の行へフォーム名を含む表示用の値を渡す', () => {
    const rows = toDashboardAnswerRows(
      [
        createAnswer({
          id: 'with-title',
          form_id: 'form-a',
          title: '回答タイトル',
          labels: [{ id: 'label-id', name: 'ラベル' }],
        }),
      ],
      new Map([['form-a', 'フォームA']])
    );

    expect(rows).toEqual([
      {
        id: 'with-title',
        formId: 'form-a',
        category: 'フォームA',
        title: '回答タイトル',
        date: '2026年06月01日 10時00分',
        labels: [{ id: 'label-id', name: 'ラベル' }],
        status: 'UNADDRESSED',
      },
    ]);
  });

  it('フォーム一覧に存在しない form_id のときは unknown form を表示する', () => {
    const rows = toDashboardAnswerRows(
      [createAnswer({ id: 'orphan', form_id: 'missing-form' })],
      new Map()
    );

    expect(rows[0]?.category).toBe('unknown form');
  });

  it('回答タイトルが null または未指定のときは未設定を示す表示へ変換する', () => {
    const rows = toDashboardAnswerRows(
      [
        createAnswer({ id: 'null-title', title: null }),
        createAnswer({ id: 'missing-title' }),
      ],
      new Map()
    );

    expect(rows.map((row) => row.title)).toEqual([
      '(タイトル未設定)',
      '(タイトル未設定)',
    ]);
  });
});
