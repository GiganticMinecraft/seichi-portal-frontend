import UsersView from './UsersView';
import { toUserListRows } from '../_lib/userListRows';
import type { GetUserListResponse } from '@/lib/api-types';

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
