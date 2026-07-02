import { describe, expect, it } from 'vitest';

import { toSearchResultRows } from '@/app/(protected)/admin/_lib/searchResultRows';
import type { SearchResponse } from '@/lib/api-types';

describe('toSearchResultRows', () => {
  it('検索結果を管理画面の遷移先付き行へ変換する', () => {
    const response = {
      forms: [
        { id: 'form-id', title: 'フォームタイトル' },
        { id: 'ignored-form' },
      ],
      answers: [
        { answer_id: 'answer-id', answer: '回答本文' },
        { answer_id: 'ignored-answer' },
      ],
      users: [{ name: 'ユーザー名' }, { id: 'ignored-user' }],
      label_for_forms: [{ name: 'フォームラベル' }, { id: 'ignored-label' }],
      label_for_answers: [{ name: '回答ラベル' }, { id: 'ignored-label' }],
      comments: [
        {
          id: 'comment-id',
          answer_id: 'comment-answer-id',
          commented_by: 'user-id',
          content: 'コメント本文',
        },
      ],
    } satisfies SearchResponse;

    expect(toSearchResultRows(response)).toEqual([
      {
        id: 0,
        category: 'フォーム',
        title: 'フォームタイトル',
        url: '/admin/forms/edit/form-id',
      },
      {
        id: 1,
        category: '回答',
        title: '回答本文',
        url: '/admin/answer/answer-id',
      },
      {
        id: 2,
        category: 'ユーザー',
        title: 'ユーザー名',
        url: '/admin/users/',
      },
      {
        id: 3,
        category: 'フォーム用ラベル',
        title: 'フォームラベル',
        url: '/admin/labels?tab=forms',
      },
      {
        id: 4,
        category: '回答用ラベル',
        title: '回答ラベル',
        url: '/admin/labels?tab=answers',
      },
      {
        id: 5,
        category: 'コメント',
        title: 'コメント本文',
        url: '/admin/answer/comment-answer-id',
      },
    ]);
  });
});
