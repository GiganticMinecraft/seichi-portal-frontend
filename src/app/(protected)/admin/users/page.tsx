import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import UsersPageContent from './_components/UsersPageContent';

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

  return <UsersPageContent users={users} currentUserId={session.user.id} />;
};

export default Home;
