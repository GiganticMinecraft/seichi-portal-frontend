import { describe, expect, it } from 'vitest';

import PunishmentHistoryView from '@/app/(protected)/(standard)/punishments/_components/PunishmentHistoryView';
import type { GetMinecraftPunishmentsResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

describe('PunishmentHistoryView', () => {
  it('処罰履歴が空の場合は空状態メッセージを表示する', () => {
    renderWithProviders(<PunishmentHistoryView punishments={[]} />);

    expect(screen.getByText('処罰履歴はありません')).toBeInTheDocument();
  });

  it('BANの理由はMarkdownとして解釈されず、プレーンテキストのまま描画される', () => {
    const punishments: GetMinecraftPunishmentsResponse = [
      {
        uuid: 'user-uuid',
        reason: '**チート行為**が確認されたため',
        punished_at: '2024-01-01T00:00:00Z',
        expires_at: null,
      },
    ];

    renderWithProviders(<PunishmentHistoryView punishments={punishments} />);

    expect(
      screen.getByText('**チート行為**が確認されたため', { exact: false })
    ).toBeInTheDocument();
    // Markdownとして解釈された場合は "**" が取り除かれ、<strong>チート行為</strong> として分割描画される
    expect(screen.queryByText('チート行為')).not.toBeInTheDocument();
  });

  it('expires_at が null の場合は「無期限」と表示される', () => {
    const punishments: GetMinecraftPunishmentsResponse = [
      {
        uuid: 'user-uuid',
        reason: '迷惑行為',
        punished_at: '2024-01-01T00:00:00Z',
        expires_at: null,
      },
    ];

    renderWithProviders(<PunishmentHistoryView punishments={punishments} />);

    expect(screen.getByText(/無期限/)).toBeInTheDocument();
  });
});
