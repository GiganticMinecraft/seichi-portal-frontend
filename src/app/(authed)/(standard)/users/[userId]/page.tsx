'use client';

import { Box, Card, CardContent, Divider, Stack } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import DiscordNotificationSettings from './_components/DiscordNotificationSettings';
import LinkDiscordButton from './_components/LinkDiscordButton';
import UnlinkDiscordButton from './_components/UnlinkDiscordButton';
import UserInformation from './_components/UserInformation';
import type {
  GetNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = use(params);
  const { data, error, isLoading } = useSWR<GetUsersResponse>(
    `/api/proxy/users/${userId}`
  );

  const {
    data: notificationSettings,
    error: notificationError,
    isLoading: isNotificationSettingsLoading,
  } = useSWR<GetNotificationSettingsResponse>(
    `/api/proxy/notifications/settings/${userId}`
  );

  if (isLoading || isNotificationSettingsLoading) {
    return <LoadingCircular />;
  } else if (error || notificationError) {
    return <ErrorModal />;
  }

  if (!data || !notificationSettings) {
    return <LoadingCircular />;
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Stack spacing={3} sx={{ maxWidth: 640, width: '100%' }}>
      <UserInformation user={data} />
      {data['discord_user_id'] ? (
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
