import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AnswerDetailsPageView from '@/app/(protected)/_components/AnswerDetail/AnswerDetailsPageView';
import type { AnswerDetailsPageData } from '@/app/(protected)/_components/AnswerDetail/AnswerDetailsPageView';
import type { AnswerComment, GetFormResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

vi.mock(
  '@/app/(protected)/_components/Conversation/useConversationActions',
  () => ({
    useCommentConversationActions: () => ({
      send: vi.fn(),
      update: vi.fn(),
      deleteEntry: vi.fn(),
    }),
    useMessageConversationActions: () => ({
      send: vi.fn(),
      update: vi.fn(),
      deleteEntry: vi.fn(),
    }),
  })
);

vi.mock(
  '@/app/(protected)/_components/Conversation/useConversationHistory',
  () => ({
    useCommentHistory: () => ({
      historyByTargetId: new Map(),
      isLoading: false,
    }),
    useMessageHistory: () => ({
      historyByTargetId: new Map(),
      isLoading: false,
    }),
  })
);

const form: GetFormResponse = {
  id: 'form-id',
  title: 'Form title',
  description: '',
  labels: [],
  metadata: {
    created_at: '2026-06-01T00:00:00+09:00',
    updated_at: '2026-06-01T00:00:00+09:00',
  },
  settings: {
    visibility: 'PUBLIC',
    allowed_group_ids: [],
    allow_temporary_answers: false,
    discord_webhook_enabled: false,
    answer_settings: {
      default_answer_title: null,
      acceptance_period: { start_at: null, end_at: null },
      visibility: 'PUBLIC',
      answer_group_ids: [],
      hide_author: false,
    },
  },
  questions: [],
};

const otherUserComment: AnswerComment = {
  id: 'comment-id',
  content: 'コメント本文',
  commented_by: { name: 'Alice', role: 'STANDARD_USER', uuid: 'other-user' },
  source: 'PORTAL',
  timestamp: '2024-01-01T00:00:00Z',
};

const baseData: AnswerDetailsPageData = {
  answer: {
    id: 'answer-id',
    form_id: 'form-id',
    timestamp: '2024-01-01T00:00:00Z',
    title: '回答タイトル',
    labels: [],
    publication: 'PUBLIC',
    author: {
      type: 'AUTHENTICATED_USER',
      user: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
    },
    answers: [],
  },
  form,
  messages: [],
  comments: [otherUserComment],
  commentsDisabled: false,
  relatedAnswers: [],
  currentUserId: 'current-user',
  isAdmin: false,
  labelOptions: [],
};

const deepLink = { entryId: undefined, onClose: vi.fn() };

describe('AnswerDetailsPageView の isAdmin 分岐(#統合)', () => {
  it('isAdmin=false の場合、管理者操作(タイトル編集・ラベル管理・コメント削除)は表示されない', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AnswerDetailsPageView
        formId="form-id"
        answerId="answer-id"
        data={baseData}
        messageDeepLink={deepLink}
        commentDeepLink={deepLink}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'タイトルを編集' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'ラベルの管理' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^メッセージ \(0\)$/ })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: /コメント \(1\)/ }));
    await user.click(
      await screen.findByRole('button', { name: 'その他の操作' })
    );
    expect(
      screen.queryByRole('menuitem', { name: '削除' })
    ).not.toBeInTheDocument();
  });

  it('isAdmin=true の場合、管理者操作(タイトル編集・ラベル管理・コメント削除)が表示される', async () => {
    const user = userEvent.setup();
    const adminData: AnswerDetailsPageData = { ...baseData, isAdmin: true };

    renderWithProviders(
      <AnswerDetailsPageView
        formId="form-id"
        answerId="answer-id"
        data={adminData}
        messageDeepLink={deepLink}
        commentDeepLink={deepLink}
      />
    );

    expect(
      screen.getByRole('button', { name: 'タイトルを編集' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'ラベルの管理' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: /^回答者にメッセージを送信 \(0\)$/ })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: /コメント \(1\)/ }));
    await user.click(
      await screen.findByRole('button', { name: 'その他の操作' })
    );
    expect(await screen.findByRole('menuitem', { name: '削除' })).toBeVisible();
  });
});

describe('AnswerDetailsPageView のメッセージボタンの権限制御', () => {
  it('管理者でも投稿者本人でもない場合、メッセージボタンは disabled になる', () => {
    renderWithProviders(
      <AnswerDetailsPageView
        formId="form-id"
        answerId="answer-id"
        data={baseData}
        messageDeepLink={deepLink}
        commentDeepLink={deepLink}
      />
    );

    expect(
      screen.getByRole('button', { name: /^メッセージ \(0\)$/ })
    ).toBeDisabled();
  });

  it('投稿者本人の場合、メッセージボタンは disabled にならない', () => {
    const authorData: AnswerDetailsPageData = {
      ...baseData,
      currentUserId: 'user-1',
    };

    renderWithProviders(
      <AnswerDetailsPageView
        formId="form-id"
        answerId="answer-id"
        data={authorData}
        messageDeepLink={deepLink}
        commentDeepLink={deepLink}
      />
    );

    expect(
      screen.getByRole('button', { name: /^メッセージ \(0\)$/ })
    ).not.toBeDisabled();
  });

  it('管理者の場合、メッセージボタンは disabled にならない', () => {
    const adminData: AnswerDetailsPageData = { ...baseData, isAdmin: true };

    renderWithProviders(
      <AnswerDetailsPageView
        formId="form-id"
        answerId="answer-id"
        data={adminData}
        messageDeepLink={deepLink}
        commentDeepLink={deepLink}
      />
    );

    expect(
      screen.getByRole('button', { name: /^回答者にメッセージを送信 \(0\)$/ })
    ).not.toBeDisabled();
  });
});
