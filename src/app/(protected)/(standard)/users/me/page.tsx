import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

import UserView from './_components/UserView';

export const metadata: Metadata = {
  title: 'ユーザー情報 | Seichi Portal',
};

const UserPage = async () => {
  const session = await requireUser();
  const [user, notificationSettings] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/users/me', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/notifications/settings/me', {
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return <UserView user={user} notificationSettings={notificationSettings} />;
};

export default UserPage;
