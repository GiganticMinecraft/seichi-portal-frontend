import { Box, Card, CardContent, Divider, Stack } from '@mui/material';

import type {
  GetNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';

import DiscordNotificationSettings from './DiscordNotificationSettings';
import LinkDiscordButton from './LinkDiscordButton';
import UnlinkDiscordButton from './UnlinkDiscordButton';
import UserInformation from './UserInformation';

const UserView = ({
  user,
  notificationSettings,
}: {
  user: GetUsersResponse;
  notificationSettings: GetNotificationSettingsResponse;
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
          <DiscordNotificationSettings currentSettings={notificationSettings} />
        </Card>
      ) : (
        <LinkDiscordButton />
      )}
    </Stack>
  </Box>
);

export default UserView;
