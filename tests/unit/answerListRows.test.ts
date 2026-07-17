import { describe, expect, it } from 'vitest';

import { toAnswerListRows } from '@/app/(protected)/(standard)/forms/[formId]/answers/_lib/answerListRows';
import type { GetFormAnswersResponse } from '@/lib/api-types';

const createAnswer = (
  overrides: Partial<GetFormAnswersResponse[number]>
): GetFormAnswersResponse[number] => ({
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
  timestamp: '2026-06-01T10:00:00+09:00',
  ...overrides,
});

describe('toAnswerListRows', () => {
  it('回答一覧の行へ表示用の値を渡す', () => {
    const rows = toAnswerListRows([
      createAnswer({ id: 'with-title', title: '回答タイトル' }),
    ]);

    expect(rows).toEqual([
      {
        id: 'with-title',
        title: '回答タイトル',
        date: '2026年06月01日 10時00分',
      },
    ]);
  });

  it('回答タイトルが null または未指定のときは未設定を示す表示へ変換する', () => {
    const rows = toAnswerListRows([
      createAnswer({ id: 'null-title', title: null }),
      createAnswer({ id: 'missing-title' }),
    ]);

    expect(rows.map((row) => row.title)).toEqual([
      '(タイトル未設定)',
      '(タイトル未設定)',
    ]);
  });
});
