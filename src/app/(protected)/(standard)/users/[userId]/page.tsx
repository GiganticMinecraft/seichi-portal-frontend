import { Box, Card, CardContent, Divider, Stack } from '@mui/material';
import DiscordNotificationSettings from './_components/DiscordNotificationSettings';
import LinkDiscordButton from './_components/LinkDiscordButton';
import UnlinkDiscordButton from './_components/UnlinkDiscordButton';
import UserInformation from './_components/UserInformation';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { Metadata } from 'next';

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
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Stack spacing={3} sx={{ maxWidth: 640, width: '100%' }}>
        <UserInformation user={user} />
        {user['discord_user_id'] ? (
          <Card variant="outlined">
            <CardContent>
              <UnlinkDiscordButton />
            </CardContent>
            <Divider />
            <DiscordNotificationSettings
              userId={userId}
              currentSettings={notificationSettings}
            />
          </Card>
        ) : (
          <LinkDiscordButton />
        )}
      </Stack>
    </Box>
  );
};

export default Home;
