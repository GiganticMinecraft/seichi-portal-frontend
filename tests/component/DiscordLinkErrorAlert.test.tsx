import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import DiscordLinkErrorAlert from '@/app/(protected)/(standard)/users/me/_components/DiscordLinkErrorAlert';

import { renderWithProviders, screen } from './render';

const { replaceMock } = vi.hoisted(() => ({ replaceMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/users/me',
  useSearchParams: () => new URLSearchParams('discordLinkError=already-linked'),
}));

describe('DiscordLinkErrorAlert', () => {
  it('文言を alert として表示し、閉じると URL からクエリを取り除く', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DiscordLinkErrorAlert message="この Discord アカウントはすでに別のユーザーに連携されています。" />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      '別のユーザーに連携されています'
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(replaceMock).toHaveBeenCalledWith('/users/me', { scroll: false });
  });
});
