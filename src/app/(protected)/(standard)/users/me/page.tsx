import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
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
      sdk.getMyUserInfo({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      sdk.getMyNotificationSettings({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return <UserView user={user} notificationSettings={notificationSettings} />;
};

export default UserPage;
