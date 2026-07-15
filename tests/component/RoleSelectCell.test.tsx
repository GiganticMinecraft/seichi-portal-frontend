import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RoleSelectCell from '@/app/(protected)/admin/users/_components/RoleSelectCell';

import { renderWithProviders, screen, waitFor } from './render';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type RoleActionMocks = {
  updateUserRole: ReturnType<
    typeof vi.fn<(uuid: string, role: string) => Promise<void>>
  >;
};

const roleActionMocks = vi.hoisted<RoleActionMocks>(() => ({
  updateUserRole: vi.fn<(uuid: string, role: string) => Promise<void>>(),
}));

vi.mock('@/hooks/useUserRoleActions', () => ({
  useUserRoleActions: () => ({
    updateUserRole: roleActionMocks.updateUserRole,
  }),
}));

describe('RoleSelectCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ロール変更中は Select が disabled になり、完了すると再度有効になる', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<undefined>();
    roleActionMocks.updateUserRole.mockReturnValue(promise);

    renderWithProviders(
      <RoleSelectCell
        userId="user-1"
        currentRole="STANDARD_USER"
        disabled={false}
      />
    );

    const select = screen.getByRole('combobox');
    await user.click(select);
    await user.click(await screen.findByRole('option', { name: '管理者' }));

    await waitFor(() => {
      expect(roleActionMocks.updateUserRole).toHaveBeenCalledTimes(1);
    });
    expect(roleActionMocks.updateUserRole).toHaveBeenCalledWith(
      'user-1',
      'ADMINISTRATOR'
    );

    await waitFor(() => {
      expect(select).toHaveAttribute('aria-disabled', 'true');
    });

    resolve(undefined);

    await waitFor(() => {
      expect(select).not.toHaveAttribute('aria-disabled', 'true');
    });
  });
});
