import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import RelatedAnswers from '@/app/(protected)/_components/AnswerDetail/RelatedAnswers';
import type { RelatedAnswerResponse } from '@/lib/api-types';

import { renderWithProviders, screen, within } from './render';

const useApiQueryMock =
  vi.fn<
    (path: string, params?: unknown) => { data: unknown; isLoading: boolean }
  >();
vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: (path: string, params?: unknown) =>
    useApiQueryMock(path, params),
}));

const addRelatedAnswerMock = vi.fn().mockResolvedValue({ ok: true });
const removeRelatedAnswerMock = vi.fn().mockResolvedValue({ ok: true });
vi.mock('@/hooks/useRelatedAnswerActions', () => ({
  useRelatedAnswerActions: () => ({
    addRelatedAnswer: addRelatedAnswerMock,
    removeRelatedAnswer: removeRelatedAnswerMock,
  }),
}));

const relations: RelatedAnswerResponse[] = [
  { form_id: 'form-id', answer_id: 'related-1' },
  { form_id: 'form-id', answer_id: 'related-2' },
];

afterEach(() => {
  vi.clearAllMocks();
  useApiQueryMock.mockReset();
});

describe('RelatedAnswers のレイアウト', () => {
  it('管理者向けの追加UIが関連回答の一覧より前に配置される', () => {
    useApiQueryMock.mockReturnValue({ data: undefined, isLoading: false });

    renderWithProviders(
      <RelatedAnswers
        relations={relations}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const container = screen.getByText('関連する回答').parentElement;
    if (!container) {
      throw new Error('container not found');
    }
    const html = container.innerHTML;
    const adderIndex = html.indexOf('関連付ける回答を検索');
    const urlAdderIndex = html.indexOf('回答のURLを貼り付けて追加');
    const listItemIndex = html.indexOf('related-1');

    expect(adderIndex).toBeGreaterThan(-1);
    expect(urlAdderIndex).toBeGreaterThan(-1);
    expect(adderIndex).toBeLessThan(
      listItemIndex === -1 ? Infinity : listItemIndex
    );
    expect(urlAdderIndex).toBeLessThan(
      listItemIndex === -1 ? Infinity : listItemIndex
    );
  });
});

describe('RelatedAnswerItem の一覧表示', () => {
  it('関連付け済みの回答をタイトル・ステータス・公開設定・日時付きの行で表示する', async () => {
    useApiQueryMock.mockImplementation((path, params) => {
      const answerId =
        params &&
        typeof params === 'object' &&
        'path' in params &&
        params.path &&
        typeof params.path === 'object' &&
        'answer_id' in params.path
          ? params.path.answer_id
          : undefined;
      if (
        path === '/api/v1/forms/{form_id}/answers/{answer_id}' &&
        answerId === 'related-1'
      ) {
        return {
          data: {
            title: '関連回答A',
            status: 'COMPLETED',
            publication: 'PRIVATE',
            timestamp: '2024-01-01T00:00:00Z',
          },
          isLoading: false,
        };
      }
      return { data: undefined, isLoading: false };
    });

    renderWithProviders(
      <RelatedAnswers
        relations={[{ form_id: 'form-id', answer_id: 'related-1' }]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    expect(await screen.findByText('関連回答A')).toBeVisible();
    expect(screen.getByText('対応済み')).toBeVisible();
    expect(screen.getByText('非公開')).toBeVisible();
  });

  it('削除ボタンをクリックしてもリンク遷移せず削除処理のみ呼ばれる', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockReturnValue({
      data: {
        title: '関連回答A',
        status: 'COMPLETED',
        publication: 'PUBLIC',
        timestamp: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    renderWithProviders(
      <RelatedAnswers
        relations={[{ form_id: 'form-id', answer_id: 'related-1' }]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    await user.click(
      await screen.findByRole('button', { name: '関連付けを解除' })
    );

    expect(removeRelatedAnswerMock).toHaveBeenCalledWith('related-1');
  });
});

describe('AdminRelatedAnswerAdder の検索候補表示', () => {
  it('未入力時は日本語の案内文を表示する(MUI既定の "No options" にしない)', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockReturnValue({ data: undefined, isLoading: false });

    renderWithProviders(
      <RelatedAnswers
        relations={[]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const input = screen.getByLabelText('関連付ける回答を検索');
    await user.click(input);

    expect(
      await screen.findByText('キーワードを入力すると候補が表示されます')
    ).toBeVisible();
  });

  it('検索候補にステータス・公開設定・日時を表示する', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockImplementation((path, params) => {
      if (path === '/api/v1/search/answers' && params !== null) {
        return {
          data: {
            answers: [
              {
                id: 'candidate-1',
                form_id: 'form-id',
                title: '候補の回答',
                status: 'IN_PROGRESS',
                publication: 'PRIVATE',
                timestamp: '2024-01-01T00:00:00Z',
                labels: [],
                answers: [],
                author: { type: 'ANONYMOUS' },
              },
            ],
          },
          isLoading: false,
        };
      }
      return { data: undefined, isLoading: false };
    });

    renderWithProviders(
      <RelatedAnswers
        relations={[]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const input = screen.getByLabelText('関連付ける回答を検索');
    await user.type(input, '候補');

    const option = await screen.findByRole(
      'option',
      { name: /候補の回答/ },
      { timeout: 2000 }
    );
    expect(within(option).getByText('対応中')).toBeVisible();
    expect(within(option).getByText('非公開')).toBeVisible();
  });
});

describe('AdminRelatedAnswerUrlAdder', () => {
  it('不正なURLを入力するとエラーメッセージを表示し、追加処理は呼ばれない', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockReturnValue({ data: undefined, isLoading: false });

    renderWithProviders(
      <RelatedAnswers
        relations={[]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const input = screen.getByLabelText('回答のURLを貼り付けて追加');
    await user.type(input, 'https://example.com/not-an-answer-url');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(
      await screen.findByText(
        '回答の詳細ページのURLを正しく貼り付けてください。'
      )
    ).toBeVisible();
    expect(addRelatedAnswerMock).not.toHaveBeenCalled();
  });

  it('正しいURLを入力すると解析したform_id/answer_idで追加処理を呼ぶ', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockReturnValue({ data: undefined, isLoading: false });

    renderWithProviders(
      <RelatedAnswers
        relations={[]}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const input = screen.getByLabelText('回答のURLを貼り付けて追加');
    await user.type(
      input,
      'https://portal.example.com/admin/forms/target-form/answers/target-answer'
    );
    await user.click(screen.getByRole('button', { name: '追加' }));

    await vi.waitFor(() => {
      expect(addRelatedAnswerMock).toHaveBeenCalledWith(
        'target-form',
        'target-answer'
      );
    });
    expect(input).toHaveValue('');
  });

  it('既に関連付け済みの回答IDを含むURLを入力するとエラーメッセージを表示する', async () => {
    const user = userEvent.setup();
    useApiQueryMock.mockReturnValue({ data: undefined, isLoading: false });

    renderWithProviders(
      <RelatedAnswers
        relations={relations}
        isAdmin
        formId="form-id"
        answerId="answer-id"
      />
    );

    const input = screen.getByLabelText('回答のURLを貼り付けて追加');
    await user.type(
      input,
      'https://portal.example.com/admin/forms/form-id/answers/related-1'
    );
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(
      await screen.findByText('この回答は既に関連付けられています。')
    ).toBeVisible();
    expect(addRelatedAnswerMock).not.toHaveBeenCalled();
  });
});
