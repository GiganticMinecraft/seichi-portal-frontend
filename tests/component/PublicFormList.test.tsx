import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PublicFormList } from '@/app/(public)/_components/PublicFormList';
import type { GetFormsResponse } from '@/lib/api-types';

import { act, renderWithProviders, screen, within } from './render';

const form = {
  description:
    '**説明** https://example.com\n\n[外部サイト](https://example.net)\n\n- [x] 確認済み',
  id: '00000000-0000-0000-0000-000000000001',
  labels: [],
  metadata: {
    created_at: '2026-09-11T00:00:00+09:00',
    updated_at: '2026-09-11T00:00:00+09:00',
  },
  questions: [],
  settings: {
    allow_temporary_answers: false,
    allowed_group_ids: [],
    answer_settings: {
      acceptance_period: {},
      answer_group_ids: [],
      visibility: 'PUBLIC',
      hide_author: false,
      answer_response_visibility: 'FULL',
    },
    discord_webhook_enabled: false,
    visibility: 'PUBLIC',
  },
  title: '公開フォーム',
} satisfies GetFormsResponse[number];

describe('PublicFormList', () => {
  it('カード全体をフォーム詳細へのリンクにし、説明内の操作要素は文字として描画する', () => {
    const { container } = renderWithProviders(
      <PublicFormList forms={[form]} />
    );

    const cardLink = screen.getByRole('link', { name: /公開フォーム/ });
    expect(cardLink).toHaveAttribute('href', `/forms/${form.id}`);
    expect(screen.getByText('公開フォーム').closest('a')).toBe(cardLink);
    expect(screen.getByText('説明').closest('a')).toBe(cardLink);
    expect(screen.getByText('https://example.com').closest('a')).toBe(cardLink);

    expect(within(cardLink).queryAllByRole('link')).toHaveLength(0);
    expect(within(cardLink).queryByRole('checkbox')).not.toBeInTheDocument();
    expect(within(cardLink).queryByRole('button')).not.toBeInTheDocument();
    expect(cardLink.querySelector('[tabindex]')).not.toBeInTheDocument();
    expect(within(cardLink).getByText('外部サイト')).toBeVisible();
    expect(within(cardLink).getByRole('listitem')).toHaveTextContent(
      '[x] 確認済み'
    );
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });

  it('URL を含むカードの SSR HTML を hydration しても不一致が起きない', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const container = document.createElement('div');
    container.innerHTML = renderToString(<PublicFormList forms={[form]} />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    const root = hydrateRoot(container, <PublicFormList forms={[form]} />, {
      onRecoverableError,
    });
    try {
      await act(() => Promise.resolve());

      expect(onRecoverableError).not.toHaveBeenCalled();
      const hydrationErrors = consoleError.mock.calls
        .flat()
        .map(String)
        .filter(
          (message) =>
            message.includes('Hydration failed') ||
            message.includes('cannot be a descendant of') ||
            message.includes('A tree hydrated but some attributes')
        );
      expect(hydrationErrors).toHaveLength(0);
    } finally {
      act(() => {
        root.unmount();
      });
      consoleError.mockRestore();
    }
  });
});
