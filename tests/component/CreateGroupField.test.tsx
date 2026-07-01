import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CreateGroupField from '@/app/(protected)/admin/groups/_components/CreateGroupField';

import { renderWithProviders, screen, waitFor } from './render';

const createGroupMock = vi.hoisted<
  ReturnType<typeof vi.fn<(name: string) => Promise<{ ok: boolean }>>>
>(() => vi.fn<(name: string) => Promise<{ ok: boolean }>>());

vi.mock('@/hooks/useUserGroupCRUD', () => ({
  useUserGroupCRUD: () => ({ createGroup: createGroupMock }),
}));

describe('CreateGroupField', () => {
  beforeEach(() => {
    createGroupMock.mockReset();
    createGroupMock.mockResolvedValue({ ok: true });
  });

  it('前後の空白をトリムしてグループを作成する', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateGroupField />);

    await user.click(screen.getByRole('button', { name: '新規作成' }));
    await user.type(
      screen.getByRole('textbox', { name: 'グループ名' }),
      '  グループA  '
    );
    await user.click(screen.getByRole('button', { name: '作成' }));

    await waitFor(() => {
      expect(createGroupMock).toHaveBeenCalledWith('グループA');
    });
  });

  it('空白のみの場合は作成せずエラーを表示する', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateGroupField />);

    await user.click(screen.getByRole('button', { name: '新規作成' }));
    await user.type(screen.getByRole('textbox', { name: 'グループ名' }), '   ');
    await user.click(screen.getByRole('button', { name: '作成' }));

    expect(
      await screen.findByText('グループ名を入力してください。')
    ).toBeVisible();
    expect(createGroupMock).not.toHaveBeenCalled();
  });
});
