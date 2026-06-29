import { describe, expect, it } from 'vitest';
import { toAnswerDetailsPageState } from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/answerDetailsPageState';
import type { QuerySnapshot } from '@/app/_swr/queryState';
import type {
  AnswerComment,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
  GetUsersResponse,
} from '@/lib/api-types';

const loading = <T>(): QuerySnapshot<T> => ({
  data: undefined,
  error: undefined,
  isLoading: true,
});

const ready = <T>(data: T): QuerySnapshot<T> => ({
  data,
  error: undefined,
  isLoading: false,
});

const answer: GetAnswerResponse = {
  id: 'answer-id',
  form_id: 'form-id',
  title: '回答タイトル',
  timestamp: '2026-01-02T03:04:05+09:00',
  labels: [],
  author: {
    type: 'AUTHENTICATED_USER',
    user: {
      uuid: 'author-id',
      name: '回答者',
      role: 'STANDARD_USER',
    },
  },
  answers: [{ question_id: 'question-id', answer: '回答本文' }],
};

const form: GetFormResponse = {
  id: 'form-id',
  title: 'フォームタイトル',
  description: '',
  labels: [],
  metadata: {
    created_at: '2026-01-01T00:00:00+09:00',
    updated_at: '2026-01-01T00:00:00+09:00',
  },
  questions: [
    {
      id: 'question-id',
      title: '質問',
      description: null,
      position: 1,
      is_required: true,
      template_key: 'text',
      question_type: 'Text',
    },
  ],
  settings: {
    visibility: 'PUBLIC',
    allow_temporary_answers: false,
    discord_webhook_url: null,
    answer_settings: {
      visibility: 'PUBLIC',
      default_answer_title: null,
      acceptance_period: {
        start_at: null,
        end_at: null,
      },
    },
  },
};

const messages: GetMessagesResponse = [
  {
    id: 'message-id',
    body: 'メッセージ',
    timestamp: '2026-01-02T03:05:05+09:00',
    sender: {
      uuid: 'sender-id',
      name: '送信者',
      role: 'STANDARD_USER',
    },
  },
];

const comments: AnswerComment[] = [
  {
    content: 'コメント',
    timestamp: '2026-01-02T03:06:05+09:00',
    commented_by: {
      uuid: 'commenter-id',
      name: 'コメント投稿者',
      role: 'STANDARD_USER',
    },
  },
];

const currentUser: GetUsersResponse = {
  id: 'current-user-id',
  name: 'ログインユーザー',
  role: 'STANDARD_USER',
};

const readyQueries = {
  answer: ready(answer),
  form: ready(form),
  currentUser: ready(currentUser),
  messages: ready(messages),
  comments: ready(comments),
};

describe('toAnswerDetailsPageState', () => {
  it('回答が未取得の間はフォーム query の前提がない状態として扱う', () => {
    expect(
      toAnswerDetailsPageState({
        ...readyQueries,
        answer: loading(),
        form: ready(form),
      })
    ).toEqual({ kind: 'loading', blockedQueries: ['form'] });
  });

  it('任意 query の currentUser が未取得でも ready になる', () => {
    expect(
      toAnswerDetailsPageState({
        ...readyQueries,
        currentUser: loading(),
      })
    ).toEqual({
      kind: 'ready',
      data: {
        answer,
        form,
        messages,
        comments,
        currentUserId: undefined,
      },
    });
  });
});
