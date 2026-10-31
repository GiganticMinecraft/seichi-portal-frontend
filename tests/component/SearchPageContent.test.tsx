import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SearchPageContent from '@/app/(protected)/admin/search/_components/SearchPageContent';
import type { SearchResponse } from '@/lib/api-types';

import { renderWithProviders, screen, within } from './render';

const createAnswer = (index: number): SearchResponse['answers'][number] => ({
  id: `answer-${index}`,
  form_id: 'form-id',
  title: `回答 ${index}`,
  answers: [],
  author: {
    type: 'AUTHENTICATED_USER',
    user: { uuid: 'user-id', name: 'ユーザー', role: 'STANDARD_USER' },
  },
  labels: [],
  publication: 'PUBLIC',
  status: 'UNADDRESSED',
  timestamp: '2026-06-01T10:00:00+09:00',
});

const createComment = (index: number): SearchResponse['comments'][number] => ({
  id: `comment-${index}`,
  answer_id: `answer-${index}`,
  form_id: 'form-id',
  commented_by: { uuid: 'user-id', name: 'ユーザー', role: 'STANDARD_USER' },
  content: `コメント ${index}`,
  source: 'PORTAL',
  timestamp: '2026-06-01T10:00:00+09:00',
  attachments: [],
});

const response: SearchResponse = {
  forms: [],
  answers: Array.from({ length: 60 }, (_, index) => createAnswer(index)),
  users: [],
  label_for_forms: [],
  label_for_answers: [],
  comments: Array.from({ length: 3 }, (_, index) => createComment(index)),
};

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams('q=保護'),
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => ({ data: response, isLoading: false, error: undefined }),
}));

const bodyRows = () => {
  const [, body] = screen.getAllByRole('rowgroup');
  if (body === undefined) {
    throw new Error('table body is missing');
  }

  return within(body).getAllByRole('row');
};

describe('SearchPageContent', () => {
  it('件数を出し、50 件ずつページングして表示する', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPageContent />);

    expect(screen.getByText('63 件')).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(50);
    expect(screen.getByText('63 件中 1–50 件')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '回答 0' })).toHaveAttribute(
      'href',
      '/admin/forms/form-id/answers/answer-0'
    );

    await user.click(screen.getByRole('button', { name: '次のページへ' }));

    expect(bodyRows()).toHaveLength(13);
    expect(screen.getByText('63 件中 51–63 件')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'コメント 2' })
    ).toBeInTheDocument();
  });

  it('種別のチップで絞り込むと、その種別だけを最初のページから表示する', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPageContent />);

    const filters = screen.getByRole('group', { name: '種別で絞り込み' });
    expect(within(filters).getByText('すべて (63)')).toBeInTheDocument();
    expect(within(filters).getByText('回答 (60)')).toBeInTheDocument();
    expect(within(filters).getByText('コメント (3)')).toBeInTheDocument();
    // 結果に無い種別のチップは出さない
    expect(within(filters).queryByText(/^ユーザー/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '次のページへ' }));
    await user.click(within(filters).getByText('コメント (3)'));

    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText('3 件中 1–3 件')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'コメント 0' })).toHaveAttribute(
      'href',
      '/admin/forms/form-id/answers/answer-0?commentId=comment-0'
    );
  });

  it('行のリンク以外をクリックしても遷移し、リンクのクリックでは二重に遷移しない', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPageContent />);

    const [firstRow] = bodyRows();
    if (firstRow === undefined) {
      throw new Error('rows are missing');
    }
    await user.click(within(firstRow).getByText('回答', { selector: 'span' }));
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(
      '/admin/forms/form-id/answers/answer-0'
    );

    await user.click(within(firstRow).getByRole('link', { name: '回答 0' }));
    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});
