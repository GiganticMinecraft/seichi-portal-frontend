import { afterEach, describe, expect, it, vi } from 'vitest';

import AnswerDetailsPageContent from '@/app/(protected)/_components/AnswerDetail/AnswerDetailsPageContent';
import { AuthenticatedUserProvider } from '@/app/_providers/currentUser';
import type { GetAnswerResponse } from '@/lib/api-types';
import { HttpError } from '@/lib/httpError';

import { renderWithProviders, screen } from './render';

type QueryResult = { data: unknown; error: unknown; isLoading: boolean };

const useApiQueryMock =
  vi.fn<(path: string, params?: unknown) => QueryResult>();
vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: (path: string, params?: unknown) =>
    useApiQueryMock(path, params),
}));

const ready = (data: unknown): QueryResult => ({
  data,
  error: undefined,
  isLoading: false,
});
const loading: QueryResult = {
  data: undefined,
  error: undefined,
  isLoading: true,
};
const notFound = (errorCode: string): QueryResult => ({
  data: undefined,
  error: new HttpError({
    message: 'HTTP 404',
    status: 404,
    url: '/api/v1/forms/form-1',
    body: { errorCode },
  }),
  isLoading: false,
});

const answer: GetAnswerResponse = {
  id: 'answer-1',
  form_id: 'form-1',
  timestamp: '2026-06-01T00:00:00+09:00',
  title: '回答タイトル',
  labels: [],
  publication: 'PUBLIC',
  status: 'UNADDRESSED',
  author: {
    type: 'AUTHENTICATED_USER',
    user: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
  },
  answers: [],
};

const renderAsAdmin = () =>
  renderWithProviders(
    <AuthenticatedUserProvider
      currentUser={{ id: 'admin-id', name: 'Admin', role: 'ADMINISTRATOR' }}
    >
      <AnswerDetailsPageContent formId="form-1" answerId="answer-1" />
    </AuthenticatedUserProvider>
  );

afterEach(() => {
  useApiQueryMock.mockReset();
});

describe('AnswerDetailsPageContent の 404 判定', () => {
  it('回答を取得済みでフォームだけが FORM_NOT_FOUND を返しても、専用の案内と復元の導線を出す', () => {
    // 回答本体 (SWR キャッシュ) やコメントなどは取れているが、その後にフォームが
    // アーカイブされ、フォームのクエリだけが先に 404 を返した状態
    useApiQueryMock.mockImplementation((path) => {
      switch (path) {
        case '/api/v1/forms/{form_id}':
          return notFound('FORM_NOT_FOUND');
        case '/api/v1/forms/{form_id}/answers/{answer_id}':
          return ready(answer);
        case '/api/v1/archived-forms/{form_id}':
          return ready({ title: '不具合報告フォーム' });
        default:
          return ready([]);
      }
    });

    renderAsAdmin();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'フォームが見つかりません',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'アーカイブ済みフォーム一覧へ' })
    ).toHaveAttribute('href', '/admin/forms?tab=archived');
    // 汎用の ErrorDialog にはならない
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('管理者でメッセージが他の応答より先に 404 を返したら、読み込み表示を続けずに専用の案内を出す', () => {
    useApiQueryMock.mockImplementation((path) =>
      path === '/api/v1/forms/{form_id}/answers/{answer_id}/messages'
        ? notFound('ANSWER_NOT_FOUND')
        : loading
    );

    renderAsAdmin();

    expect(
      screen.getByRole('heading', { level: 1, name: '回答が見つかりません' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
