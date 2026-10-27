import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import DiscordLinkErrorAlert from '@/app/(protected)/(standard)/users/me/_components/DiscordLinkErrorAlert';

import { renderWithProviders, screen } from './render';

describe('DiscordLinkErrorAlert', () => {
  beforeEach(() => {
    window.history.replaceState(
      null,
      '',
      '/users/me?discordLinkError=already-linked'
    );
  });

  it('文言を alert として表示し、閉じると消えて URL からクエリを取り除く', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DiscordLinkErrorAlert message="この Discord アカウントはすでに別のユーザーに連携されています。" />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      '別のユーザーに連携されています'
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/users/me');
    expect(window.location.search).toBe('');
  });
});
