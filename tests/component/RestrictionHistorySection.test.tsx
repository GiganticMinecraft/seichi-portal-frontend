import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RestrictionHistorySection from '@/app/(protected)/admin/users/_components/UserDetailDialog/RestrictionHistorySection';
import type { GetAnswerSubmitterRestrictionHistoryResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

type HistoryQueryState = {
  data: GetAnswerSubmitterRestrictionHistoryResponse | undefined;
  error: Error | null;
  isLoading: boolean;
};

const queryState = vi.hoisted<HistoryQueryState>(() => ({
  data: undefined,
  error: null,
  isLoading: false,
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => queryState,
}));

describe('RestrictionHistorySection', () => {
  beforeEach(() => {
    queryState.data = undefined;
    queryState.error = null;
    queryState.isLoading = false;
  });

  it('処罰理由は Markdown として解釈され、強調記法が実際の要素として描画される(#833)', async () => {
    const user = userEvent.setup();
    queryState.data = [
      {
        id: 'restriction-1',
        submitter_id: 'user-uuid',
        reason: '**迷惑行為**が確認されたため',
        restricted_at: '2024-01-01T00:00:00Z',
        restricted_by: 'operator-id',
        expires_at: null,
        lifted_at: null,
        lifted_by: null,
      },
    ];

    renderWithProviders(<RestrictionHistorySection uuid="user-uuid" />);

    await user.click(screen.getByRole('button', { name: /処罰履歴（1件）/ }));

    const strong = await screen.findByText('迷惑行為');
    expect(strong.tagName).toBe('STRONG');
  });
});
