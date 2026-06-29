import { describe, expect, it } from 'vitest';
import { toUserListRows } from '@/app/(protected)/admin/users/_lib/userListRows';
import type { GetUserListResponse } from '@/lib/api-types';

const users = [
  { id: 'self-user', name: '自分', role: 'ADMINISTRATOR' },
  { id: 'other-user', name: '他のユーザー', role: 'STANDARD_USER' },
] satisfies GetUserListResponse;

describe('toUserListRows', () => {
  it('現在のユーザーだけ権限変更と制限管理を無効にする', () => {
    const rows = toUserListRows(users, 'self-user');

    expect(rows).toEqual([
      {
        user: users[0],
        isSelf: true,
        canManageRole: false,
        canManageRestriction: false,
      },
      {
        user: users[1],
        isSelf: false,
        canManageRole: true,
        canManageRestriction: true,
      },
    ]);
  });
});
