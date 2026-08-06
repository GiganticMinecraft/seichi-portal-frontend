import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GlobalWebhookSettings from '@/app/(protected)/admin/webhooks/_components/GlobalWebhookSettings';

import { renderWithProviders, screen } from './render';

const { updateWebhookMock } = vi.hoisted(() => ({
  updateWebhookMock: vi
    .fn<(url: string | null) => Promise<{ ok: boolean }>>()
    .mockResolvedValue({ ok: true }),
}));

vi.mock('@/hooks/useGlobalDiscordWebhook', () => ({
  useGlobalDiscordWebhook: () => ({ updateWebhook: updateWebhookMock }),
}));

describe('GlobalWebhookSettings', () => {
  beforeEach(() => {
    updateWebhookMock.mockClear();
  });

  it('未設定時は変更ボタンのみ表示し、保存ボタンは無効', () => {
    renderWithProviders(
      <GlobalWebhookSettings currentStatus={{ enabled: false }} />
    );

    expect(screen.getByText('未設定')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '変更' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '削除' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
  });

  it('変更ボタンで URL を入力すると保存ボタンが有効になり、送信すると新しい URL が送られる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <GlobalWebhookSettings currentStatus={{ enabled: false }} />
    );

    await user.click(screen.getByRole('button', { name: '変更' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Discord Webhook URL' }),
      'https://discord.com/api/webhooks/xxx'
    );

    const saveButton = screen.getByRole('button', { name: '保存' });
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    expect(updateWebhookMock).toHaveBeenCalledWith(
      'https://discord.com/api/webhooks/xxx'
    );
  });

  it('設定済みの場合、削除ボタンで削除予定にでき、保存すると null が送られる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <GlobalWebhookSettings currentStatus={{ enabled: true }} />
    );

    expect(screen.getByText('設定済み')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '削除' }));

    expect(screen.getByText('削除予定')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(updateWebhookMock).toHaveBeenCalledWith(null);
  });
});
