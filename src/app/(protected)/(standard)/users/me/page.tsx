import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
import { resolveDiscordLinkErrorMessage } from '@/lib/discordLinkError';
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

const UserPage = async (props: {
  searchParams: Promise<{ discordLinkError?: string | string[] }>;
}) => {
  const session = await requireUser();
  const [user, notificationSettings, searchParams] = await Promise.all([
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
    props.searchParams,
  ]);

  return (
    <UserView
      user={user}
      notificationSettings={notificationSettings}
      discordLinkErrorMessage={resolveDiscordLinkErrorMessage(
        searchParams.discordLinkError
      )}
    />
  );
};

export default UserPage;
