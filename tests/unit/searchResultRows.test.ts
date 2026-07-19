import { describe, expect, it } from 'vitest';

import { toSearchResultRows } from '@/app/(protected)/admin/_lib/searchResultRows';
import type { SearchResponse } from '@/lib/api-types';

const createForm = (
  overrides: Partial<SearchResponse['forms'][number]>
): SearchResponse['forms'][number] => ({
  id: 'form-id',
  title: 'フォームタイトル',
  description: '',
  labels: [],
  questions: [],
  metadata: {
    created_at: '2026-06-01T10:00:00+09:00',
    updated_at: '2026-06-01T10:00:00+09:00',
  },
  settings: {
    allow_temporary_answers: false,
    allowed_group_ids: [],
    answer_settings: {
      acceptance_period: {},
      answer_group_ids: [],
      visibility: 'PUBLIC',
    },
    visibility: 'PUBLIC',
  },
  ...overrides,
});

const createAnswer = (
  overrides: Partial<SearchResponse['answers'][number]>
): SearchResponse['answers'][number] => ({
  id: 'answer-id',
  form_id: 'form-id',
  answers: [],
  author: {
    type: 'AUTHENTICATED_USER',
    user: { uuid: 'user-id', name: 'ユーザー', role: 'STANDARD_USER' },
  },
  labels: [],
  timestamp: '2026-06-01T10:00:00+09:00',
  ...overrides,
});

const createUser = (
  overrides: Partial<SearchResponse['users'][number]>
): SearchResponse['users'][number] => ({
  id: 'user-id',
  name: 'ユーザー名',
  role: 'STANDARD_USER',
  groups: [],
  ...overrides,
});

const createLabel = (
  overrides: Partial<SearchResponse['label_for_forms'][number]>
): SearchResponse['label_for_forms'][number] => ({
  id: 'label-id',
  name: 'ラベル名',
  ...overrides,
});

const createComment = (
  overrides: Partial<SearchResponse['comments'][number]>
): SearchResponse['comments'][number] => ({
  id: 'comment-id',
  answer_id: 'comment-answer-id',
  commented_by: { uuid: 'user-id', name: 'ユーザー', role: 'STANDARD_USER' },
  content: 'コメント本文',
  timestamp: '2026-06-01T10:00:00+09:00',
  ...overrides,
});

describe('toSearchResultRows', () => {
  it('検索結果を管理画面の遷移先付き行へ変換する', () => {
    const response: SearchResponse = {
      forms: [createForm({ id: 'form-id', title: 'フォームタイトル' })],
      answers: [createAnswer({ id: 'answer-id', title: '回答タイトル' })],
      users: [createUser({ id: 'user-id', name: 'ユーザー名' })],
      label_for_forms: [
        createLabel({ id: 'form-label-id', name: 'フォームラベル' }),
      ],
      label_for_answers: [
        createLabel({ id: 'answer-label-id', name: '回答ラベル' }),
      ],
      comments: [
        createComment({
          answer_id: 'comment-answer-id',
          content: 'コメント本文',
        }),
      ],
    };

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
        title: '回答タイトル',
        url: '/admin/answer/answer-id',
      },
      {
        id: 2,
        category: 'ユーザー',
        title: 'ユーザー名',
        url: '/admin/users?userId=user-id&userName=%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E5%90%8D',
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

  it('回答タイトルが未設定のときは未設定を示す表示へ変換する', () => {
    const response: SearchResponse = {
      forms: [],
      answers: [createAnswer({ id: 'answer-id', title: null })],
      users: [],
      label_for_forms: [],
      label_for_answers: [],
      comments: [],
    };

    expect(toSearchResultRows(response)[0]?.title).toBe('(タイトル未設定)');
  });
});
