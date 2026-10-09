import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import UsersPageContent from './_components/UsersTable/UsersPageContent';

export const metadata: Metadata = {
  title: 'ユーザー管理 | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const initialUsers = await requireBackendData(
    sdk.userList({
      client: serverApiClient,
      headers: authorizationHeader(session.token),
    })
  );

  return (
    <UsersPageContent
      initialUsers={initialUsers}
      currentUserId={session.user.id}
    />
  );
};

export default Home;
