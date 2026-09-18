import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SearchField from '@/app/(protected)/admin/_components/SearchField';

import { renderWithProviders, screen } from './render';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => ({ data: undefined }),
}));

vi.mock('@/hooks/useDebouncedSearch', () => ({
  useDebouncedSearch: () => ({
    search: '',
    debouncedSearch: '',
    isSearching: false,
    handleSearchChange: vi.fn(),
  }),
}));

describe('SearchField', () => {
  it('モバイル用の検索欄を開くと入力欄へフォーカスする', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchField />);

    await user.click(screen.getByRole('button', { name: '検索欄を開く' }));

    expect(
      screen.getByRole('combobox', { name: '検索内容を入力' })
    ).toHaveFocus();
  });
});
