import { describe, expect, it } from 'vitest';
import { toAdminAnswerPageState } from '@/app/(protected)/admin/answer/[answerId]/adminAnswerPageState';
import type { QuerySnapshot } from '@/app/_swr/queryState';
import type {
  AnswerComment,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
  GetFormResponse,
  GetMessagesResponse,
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

const answer: GetAnswersResponse[number] = {
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

const allAnswers: GetAnswersResponse = [answer];

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

const labels: GetAnswerLabelsResponse = [{ id: 'label-id', name: 'ラベル' }];
const messages: GetMessagesResponse = [];
const comments: AnswerComment[] = [];

const readyQueries = {
  answerId: 'answer-id',
  allAnswers: ready(allAnswers),
  form: ready(form),
  labels: ready(labels),
  messages: ready(messages),
  comments: ready(comments),
};

describe('toAdminAnswerPageState', () => {
  it('回答一覧が未取得の間は回答に依存する query を前提待ちとして扱う', () => {
    expect(
      toAdminAnswerPageState({
        ...readyQueries,
        allAnswers: loading(),
      })
    ).toEqual({
      kind: 'loading',
      blockedQueries: ['form', 'messages', 'comments'],
    });
  });

  it('回答一覧に対象回答がない場合は notFound として扱う', () => {
    expect(
      toAdminAnswerPageState({
        ...readyQueries,
        answerId: 'missing-answer-id',
      })
    ).toEqual({ kind: 'notFound' });
  });

  it('すべての必須 query が揃うと ready data を返す', () => {
    expect(toAdminAnswerPageState(readyQueries)).toEqual({
      kind: 'ready',
      data: {
        answer,
        form,
        labels,
        messages,
        comments,
      },
    });
  });
});
