import { describe, expect, it } from 'vitest';

import { toMyAnswerListRows } from '@/app/(protected)/(standard)/answers/_components/myAnswerListRows';
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

describe('toMyAnswerListRows', () => {
  it('回答一覧の行へ、遷移先の特定に使う formId を含めて変換する', () => {
    const rows = toMyAnswerListRows([
      createAnswer({
        id: 'with-title',
        form_id: 'form-a',
        title: '回答タイトル',
        labels: [{ id: 'label-id', name: 'ラベル' }],
      }),
    ]);

    expect(rows).toEqual([
      {
        id: 'with-title',
        formId: 'form-a',
        title: '回答タイトル',
        date: '2026年06月01日 10時00分',
        labels: [{ id: 'label-id', name: 'ラベル' }],
        status: 'UNADDRESSED',
      },
    ]);
  });

  it('複数フォームの回答が混在しても、行ごとに元の formId を保持する', () => {
    const rows = toMyAnswerListRows([
      createAnswer({ id: 'answer-1', form_id: 'form-a' }),
      createAnswer({ id: 'answer-2', form_id: 'form-b' }),
    ]);

    expect(rows.map((row) => ({ id: row.id, formId: row.formId }))).toEqual([
      { id: 'answer-1', formId: 'form-a' },
      { id: 'answer-2', formId: 'form-b' },
    ]);
  });
});
