import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LinkDiscordButton from '@/app/(protected)/(standard)/users/me/_components/LinkDiscordButton';
import NavBar from '@/app/_components/NavBar';
import { AuthenticatedUserProvider } from '@/app/_providers/currentUser';

import { renderWithProviders, screen } from './render';

vi.mock('@/app/_components/NotificationBell', () => ({
  default: () => null,
}));

vi.mock('@/app/_components/ThemeModeToggle', () => ({
  default: () => null,
}));

describe('ユーザーページへの導線', () => {
  it('ユーザーメニューから本人のユーザーページへ移動できる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AuthenticatedUserProvider
        currentUser={{
          id: 'user-id',
          name: 'Alice',
          role: 'STANDARD_USER',
        }}
      >
        <NavBar />
      </AuthenticatedUserProvider>
    );

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));

    expect(
      await screen.findByRole('menuitem', {
        name: 'ユーザー情報・設定変更',
      })
    ).toHaveAttribute('href', '/users/me');
  });

  it('Discord 連携後の復帰先に本人のユーザーページを指定する', () => {
    renderWithProviders(<LinkDiscordButton />);

    expect(
      screen.getByRole('link', { name: 'Discord と連携する' })
    ).toHaveAttribute('href', '/api/discord?returnTo=%2Fusers%2Fme');
  });
});
