import type { GetUserListResponse } from '@/lib/api-types';

import { toUserListRows } from '../_lib/userListRows';

import UsersView from './UsersView';

const UsersPageContent = ({
  users,
  currentUserId,
}: {
  users: GetUserListResponse;
  currentUserId: string;
}) => {
  const rows = toUserListRows(users, currentUserId);

  return <UsersView rows={rows} />;
};

export default UsersPageContent;
