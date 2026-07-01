import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UserGroupMembershipSection from '@/app/(protected)/admin/users/_components/UserGroupMembershipSection';
import type { UserGroupSchema } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

type GroupListQueryState = {
  data: UserGroupSchema[] | undefined;
  error: Error | null;
  isLoading: boolean;
};

type MembershipMocks = {
  queryState: GroupListQueryState;
  addUserToGroup: ReturnType<
    typeof vi.fn<
      (groupId: string, userId: string) => Promise<{ success: boolean }>
    >
  >;
  removeUserFromGroup: ReturnType<
    typeof vi.fn<
      (groupId: string, userId: string) => Promise<{ success: boolean }>
    >
  >;
};

const membershipMocks = vi.hoisted<MembershipMocks>(() => ({
  queryState: {
    data: [
      { id: 'group-1', name: 'グループA' },
      { id: 'group-2', name: 'グループB' },
    ],
    error: null,
    isLoading: false,
  },
  addUserToGroup:
    vi.fn<(groupId: string, userId: string) => Promise<{ success: boolean }>>(),
  removeUserFromGroup:
    vi.fn<(groupId: string, userId: string) => Promise<{ success: boolean }>>(),
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => membershipMocks.queryState,
}));

vi.mock('@/hooks/useUserGroupMembershipActions', () => ({
  useUserGroupMembershipActions: () => ({
    addUserToGroup: membershipMocks.addUserToGroup,
    removeUserFromGroup: membershipMocks.removeUserFromGroup,
  }),
}));

describe('UserGroupMembershipSection', () => {
  const onChanged = vi.fn<() => Promise<void>>();

  beforeEach(() => {
    membershipMocks.queryState.data = [
      { id: 'group-1', name: 'グループA' },
      { id: 'group-2', name: 'グループB' },
    ];
    membershipMocks.addUserToGroup.mockResolvedValue({ success: true });
    membershipMocks.removeUserFromGroup.mockResolvedValue({ success: true });
    onChanged.mockResolvedValue();
    vi.clearAllMocks();
  });

  it('未所属のグループを選択して追加する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <UserGroupMembershipSection
        uuid="user-uuid"
        currentGroups={[]}
        disabled={false}
        onChanged={onChanged}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'グループを追加' }));
    await user.click(await screen.findByRole('option', { name: 'グループA' }));

    await waitFor(() => {
      expect(membershipMocks.addUserToGroup).toHaveBeenCalledWith(
        'group-1',
        'user-uuid'
      );
      expect(onChanged).toHaveBeenCalledOnce();
    });
  });

  it('所属済みグループのChipを削除するとグループから外す', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <UserGroupMembershipSection
        uuid="user-uuid"
        currentGroups={[{ id: 'group-1', name: 'グループA' }]}
        disabled={false}
        onChanged={onChanged}
      />
    );

    const chip = screen.getByText('グループA').closest('.MuiChip-root');
    if (!chip) throw new Error('Chip not found');
    const deleteIcon = chip.querySelector('.MuiChip-deleteIcon');
    if (!deleteIcon) throw new Error('delete icon not found');
    await user.click(deleteIcon);

    await waitFor(() => {
      expect(membershipMocks.removeUserFromGroup).toHaveBeenCalledWith(
        'group-1',
        'user-uuid'
      );
      expect(onChanged).toHaveBeenCalledOnce();
    });
  });

  it('disabled のときは追加・削除の操作ができない', () => {
    renderWithProviders(
      <UserGroupMembershipSection
        uuid="user-uuid"
        currentGroups={[{ id: 'group-1', name: 'グループA' }]}
        disabled
        onChanged={onChanged}
      />
    );

    expect(
      screen.getByRole('combobox', { name: 'グループを追加' })
    ).toBeDisabled();
    const chip = screen.getByText('グループA').closest('.MuiChip-root');
    expect(chip?.querySelector('.MuiChip-deleteIcon')).toBeNull();
  });
});
