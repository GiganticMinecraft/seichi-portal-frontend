import UserList from './_components/UserList';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { getAdminAccess } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー管理 | Seichi Portal',
};

const Home = async () => {
  const adminAccess = await getAdminAccess();
  if (adminAccess.state === 'forbidden') {
    return <ErrorDialog status={403} showDiagnostics={false} />;
  }
  const { session } = adminAccess;
  const users = await requireBackendData(
    serverApiClient.GET('/api/v1/users', {
      headers: authorizationHeader(session.token),
    })
  );

  return <UserList users={users} currentUserId={session.user.id} />;
};

export default Home;
