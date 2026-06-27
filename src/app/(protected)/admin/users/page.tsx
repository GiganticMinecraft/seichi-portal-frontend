import UserList from './_components/UserList';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー管理 | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const users = await requireBackendData(
    serverApiClient.GET('/api/v1/users', {
      headers: authorizationHeader(session.token),
    })
  );

  return <UserList users={users} currentUserId={session.user.id} />;
};

export default Home;
