import { describe, expect, it } from 'vitest';

import { filterAnswersByFormAndDate } from '@/app/(protected)/admin/_lib/dashboardAnswerFilters';
import type { GetAnswersResponse } from '@/lib/api-types';

const answer = (
  id: string,
  formId: string,
  timestamp: string
): GetAnswersResponse[number] => ({
  id,
  form_id: formId,
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
  timestamp,
});

const answers = [
  answer('answer-1', 'form-a', '2026-06-01T10:00:00+09:00'),
  answer('answer-2', 'form-b', '2026-06-10T10:00:00+09:00'),
  answer('answer-3', 'form-a', '2026-06-20T10:00:00+09:00'),
] satisfies GetAnswersResponse;

const noFilter = { formIds: [], dateRange: { startIso: null, endIso: null } };

describe('filterAnswersByFormAndDate', () => {
  it('フォーム・日付とも未指定のときは全件を返す', () => {
    const filtered = filterAnswersByFormAndDate(answers, noFilter);

    expect(filtered.map((a) => a.id)).toEqual([
      'answer-1',
      'answer-2',
      'answer-3',
    ]);
  });

  it('選択したフォーム ID のいずれかに一致する回答だけを残す', () => {
    const filtered = filterAnswersByFormAndDate(answers, {
      ...noFilter,
      formIds: ['form-a'],
    });

    expect(filtered.map((a) => a.id)).toEqual(['answer-1', 'answer-3']);
  });

  it('日付範囲は両端を含めて絞り込む', () => {
    const filtered = filterAnswersByFormAndDate(answers, {
      ...noFilter,
      dateRange: {
        startIso: '2026-06-01T01:00:00.000Z',
        endIso: '2026-06-10T01:00:00.000Z',
      },
    });

    // answer-1: 2026-06-01T01:00:00Z (=10:00+09:00) は開始境界と一致するため含む
    // answer-2: 2026-06-10T01:00:00Z (=10:00+09:00) は終了境界と一致するため含む
    // answer-3: 2026-06-20T01:00:00Z は範囲外のため除外
    expect(filtered.map((a) => a.id)).toEqual(['answer-1', 'answer-2']);
  });

  it('フォームと日付範囲は AND 条件で絞り込む', () => {
    const filtered = filterAnswersByFormAndDate(answers, {
      formIds: ['form-a'],
      dateRange: {
        startIso: '2026-06-01T00:00:00.000Z',
        endIso: '2026-06-05T00:00:00.000Z',
      },
    });

    expect(filtered.map((a) => a.id)).toEqual(['answer-1']);
  });
});
