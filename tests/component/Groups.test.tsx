import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Groups from '@/app/(protected)/admin/groups/_components/Groups';

import { renderWithProviders, screen, waitFor, within } from './render';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type GroupCRUDMocks = {
  editGroup: ReturnType<
    typeof vi.fn<(id: string, name: string) => Promise<{ ok: boolean }>>
  >;
  deleteGroup: ReturnType<
    typeof vi.fn<(id: string) => Promise<{ ok: boolean }>>
  >;
};

const groupCRUDMocks = vi.hoisted<GroupCRUDMocks>(() => ({
  editGroup: vi.fn<(id: string, name: string) => Promise<{ ok: boolean }>>(),
  deleteGroup: vi.fn<(id: string) => Promise<{ ok: boolean }>>(),
}));

vi.mock('@/hooks/useUserGroupCRUD', () => ({
  useUserGroupCRUD: () => ({
    createGroup: vi.fn(),
    editGroup: groupCRUDMocks.editGroup,
    deleteGroup: groupCRUDMocks.deleteGroup,
  }),
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => ({ data: undefined, error: null, isLoading: false }),
}));

vi.mock('@/app/(protected)/admin/groups/_components/GroupDetailDialog', () => ({
  default: () => null,
}));

describe('Groups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    groupCRUDMocks.editGroup.mockResolvedValue({ ok: true });
    groupCRUDMocks.deleteGroup.mockResolvedValue({ ok: true });
  });

  it('グループが無い場合は空メッセージを表示する', () => {
    renderWithProviders(<Groups groups={[]} currentUserId="current-user" />);

    expect(screen.getByText('グループが登録されていません。')).toBeVisible();
  });

  it('グループ名を編集する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Groups
        groups={[{ id: 'group-1', name: 'グループA' }]}
        currentUserId="current-user"
      />
    );

    await user.click(screen.getByRole('button', { name: '編集' }));
    const nameInput = screen.getByRole('textbox', { name: 'グループ名' });
    await user.clear(nameInput);
    await user.type(nameInput, 'グループA改');
    await user.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(groupCRUDMocks.editGroup).toHaveBeenCalledWith(
        'group-1',
        'グループA改'
      );
    });
  });

  it('確認ダイアログで承認するとグループを削除する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Groups
        groups={[{ id: 'group-1', name: 'グループA' }]}
        currentUserId="current-user"
      />
    );

    await user.click(screen.getByRole('button', { name: '削除' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    await waitFor(() => {
      expect(groupCRUDMocks.deleteGroup).toHaveBeenCalledWith('group-1');
    });
  });

  it('削除処理が完了するまでダイアログのボタンを無効化する', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<{ ok: boolean }>();
    groupCRUDMocks.deleteGroup.mockReturnValue(promise);

    renderWithProviders(
      <Groups
        groups={[{ id: 'group-1', name: 'グループA' }]}
        currentUserId="current-user"
      />
    );

    await user.click(screen.getByRole('button', { name: '削除' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    await waitFor(() => {
      expect(groupCRUDMocks.deleteGroup).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', { name: '削除' })
      ).toBeDisabled();
    });
    expect(
      within(dialog).getByRole('button', { name: 'キャンセル' })
    ).toBeDisabled();

    resolve({ ok: true });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
