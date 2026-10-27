import { Box, Card, CardContent, Divider, Stack } from '@mui/material';

import type {
  GetNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';

import DiscordLinkErrorAlert from './DiscordLinkErrorAlert';
import DiscordNotificationSettings from './DiscordNotificationSettings';
import LinkDiscordButton from './LinkDiscordButton';
import UnlinkDiscordButton from './UnlinkDiscordButton';
import UserInformation from './UserInformation';

const UserView = ({
  user,
  notificationSettings,
  discordLinkErrorMessage,
}: {
  user: GetUsersResponse;
  notificationSettings: GetNotificationSettingsResponse;
  /** Discord 連携の失敗を伝える文言 (`/api/discord` から戻ってきたときだけ) */
  discordLinkErrorMessage?: string | undefined;
}) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Stack spacing={3} sx={{ maxWidth: 640, width: '100%' }}>
      <UserInformation user={user} />
      {discordLinkErrorMessage !== undefined && (
        <DiscordLinkErrorAlert message={discordLinkErrorMessage} />
      )}
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
