import { Box, Card, CardContent, Divider, Stack } from '@mui/material';
import DiscordNotificationSettings from './_components/DiscordNotificationSettings';
import LinkDiscordButton from './_components/LinkDiscordButton';
import UnlinkDiscordButton from './_components/UnlinkDiscordButton';
import UserInformation from './_components/UserInformation';
import { backendFetchJson } from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type {
  GetNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';
import type { paths } from '@/generated/api-types';
import type { Metadata } from 'next';

type UserNotificationSettingsResponse =
  paths['/notifications/settings/{uuid}']['get']['responses'][200]['content']['application/json'];

export const metadata: Metadata = {
  title: 'ユーザー情報 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const session = await requireUser();
  const { userId } = await params;
  const [user, notificationSettings] = await Promise.all([
    backendFetchJson<GetUsersResponse>(`/users/${userId}`, {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<UserNotificationSettingsResponse>(
      `/notifications/settings/${userId}`,
      {
        method: 'GET',
        token: session.token,
      }
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
              currentSettings={
                notificationSettings as GetNotificationSettingsResponse
              }
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
