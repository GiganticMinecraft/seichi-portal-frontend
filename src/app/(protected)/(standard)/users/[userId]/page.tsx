import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

import UserPageContent from './_components/UserPageContent';

export const metadata: Metadata = {
  title: 'ユーザー情報 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const session = await requireUser();
  const { userId } = await params;
  const [user, notificationSettings] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/users/{uuid}', {
        headers: authorizationHeader(session.token),
        params: {
          path: { uuid: userId },
        },
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/notifications/settings/{uuid}', {
        headers: authorizationHeader(session.token),
        params: {
          path: { uuid: userId },
        },
      })
    ),
  ]);

  return (
    <UserPageContent
      user={user}
      userId={userId}
      notificationSettings={notificationSettings}
    />
  );
};

export default Home;
