import { describe, expect, it } from 'vitest';

import { filterAnswers } from '@/app/(protected)/_components/AnswersList/answerListFilters';
import type {
  GetAnswerLabelsResponse,
  GetFormAnswersResponse,
} from '@/lib/api-types';

const labels = {
  urgent: { id: 'label-urgent', name: '緊急' },
  reviewed: { id: 'label-reviewed', name: '確認済み' },
  spam: { id: 'label-spam', name: 'スパム' },
} satisfies Record<string, GetAnswerLabelsResponse[number]>;

const answer = (
  id: string,
  answerLabels: GetAnswerLabelsResponse
): GetFormAnswersResponse[number] => ({
  id,
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
  labels: answerLabels,
  publication: 'PUBLIC',
  timestamp: '2026-06-01T10:00:00+09:00',
});

const answers = [
  answer('answer-1', [labels.urgent, labels.reviewed]),
  answer('answer-2', [labels.reviewed]),
  answer('answer-3', [labels.spam]),
] satisfies GetFormAnswersResponse;

describe('filterAnswers', () => {
  it('ラベル未選択のときは全件を返す', () => {
    const filtered = filterAnswers(answers, { labels: [] });

    expect(filtered.map((answer) => answer.id)).toEqual([
      'answer-1',
      'answer-2',
      'answer-3',
    ]);
  });

  it('選択したラベルをすべて持つ回答だけを残す', () => {
    const filtered = filterAnswers(answers, {
      labels: [labels.urgent, labels.reviewed],
    });

    expect(filtered.map((answer) => answer.id)).toEqual(['answer-1']);
  });

  it('どの回答も持たないラベルを選択した場合は空になる', () => {
    const filtered = filterAnswers(answers, {
      labels: [labels.urgent, labels.spam],
    });

    expect(filtered).toEqual([]);
  });
});
