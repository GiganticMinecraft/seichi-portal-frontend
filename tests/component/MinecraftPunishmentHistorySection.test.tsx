import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MinecraftPunishmentHistorySection from '@/app/(protected)/admin/users/_components/UserDetailDialog/MinecraftPunishmentHistorySection';
import type { GetMinecraftPunishmentsResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

type HistoryQueryState = {
  data: GetMinecraftPunishmentsResponse | undefined;
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

describe('MinecraftPunishmentHistorySection', () => {
  beforeEach(() => {
    queryState.data = undefined;
    queryState.error = null;
    queryState.isLoading = false;
  });

  it('BANの理由はMarkdownとして解釈されず、プレーンテキストのまま描画される', async () => {
    const user = userEvent.setup();
    queryState.data = [
      {
        uuid: 'user-uuid',
        reason: '**チート行為**が確認されたため',
        punished_at: '2024-01-01T00:00:00Z',
        expires_at: null,
      },
    ];

    renderWithProviders(<MinecraftPunishmentHistorySection uuid="user-uuid" />);

    await user.click(
      screen.getByRole('button', { name: /Minecraft BAN履歴（1件）/ })
    );

    expect(
      await screen.findByText('**チート行為**が確認されたため', {
        exact: false,
      })
    ).toBeInTheDocument();
    // Markdownとして解釈された場合は "**" が取り除かれ、<strong>チート行為</strong> として分割描画される
    expect(screen.queryByText('チート行為')).not.toBeInTheDocument();
  });

  it('expires_at が null の場合は「無期限」と表示される', async () => {
    const user = userEvent.setup();
    queryState.data = [
      {
        uuid: 'user-uuid',
        reason: '迷惑行為',
        punished_at: '2024-01-01T00:00:00Z',
        expires_at: null,
      },
    ];

    renderWithProviders(<MinecraftPunishmentHistorySection uuid="user-uuid" />);

    await user.click(
      screen.getByRole('button', { name: /Minecraft BAN履歴（1件）/ })
    );

    expect(await screen.findByText(/無期限/)).toBeInTheDocument();
  });
});
