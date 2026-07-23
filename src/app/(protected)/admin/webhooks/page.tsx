import { Stack, Typography } from '@mui/material';
import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import GlobalWebhookSettings from './_components/GlobalWebhookSettings';

export const metadata: Metadata = {
  title: 'Webhook 設定 | Seichi Portal',
};

const Page = async () => {
  const { session } = await getAdminAccess();
  const status = await requireBackendData(
    serverApiClient.GET('/api/v1/settings/global-discord-webhook', {
      headers: authorizationHeader(session.token),
    })
  );

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1">
        Webhook 設定
      </Typography>
      <GlobalWebhookSettings currentStatus={status} />
    </Stack>
  );
};

export default Page;
