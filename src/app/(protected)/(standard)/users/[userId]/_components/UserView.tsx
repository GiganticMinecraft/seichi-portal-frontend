import { Box, Card, CardContent, Divider, Stack } from '@mui/material';

import type {
  GetUserNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';

import DiscordNotificationSettings from './DiscordNotificationSettings';
import LinkDiscordButton from './LinkDiscordButton';
import UnlinkDiscordButton from './UnlinkDiscordButton';
import UserInformation from './UserInformation';

const UserView = ({
  user,
  userId,
  notificationSettings,
}: {
  user: GetUsersResponse;
  userId: string;
  notificationSettings: GetUserNotificationSettingsResponse;
}) => (
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

export default UserView;
