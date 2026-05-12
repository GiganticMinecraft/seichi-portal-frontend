import UserList from './_components/UserList';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetUserListResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー管理 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const users = await backendFetchJson<GetUserListResponse>('/users', {
    method: 'GET',
    token: session.token,
  });

  return <UserList users={users} />;
};

export default Home;
