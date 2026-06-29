import type { GetUserListResponse } from '@/lib/api-types';

export interface UserListRow {
  user: GetUserListResponse[number];
  isSelf: boolean;
  canManageRole: boolean;
  canManageRestriction: boolean;
}

export const toUserListRows = (
  users: GetUserListResponse,
  currentUserId: string
): UserListRow[] =>
  users.map((user) => {
    const isSelf = user.id === currentUserId;
    return {
      user,
      isSelf,
      canManageRole: !isSelf,
      canManageRestriction: !isSelf,
    };
  });
