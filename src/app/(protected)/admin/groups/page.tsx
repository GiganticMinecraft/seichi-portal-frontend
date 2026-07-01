import { Stack, Typography } from '@mui/material';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import CreateGroupField from './_components/CreateGroupField';
import Groups from './_components/Groups';

export const metadata: Metadata = {
  title: 'グループ管理 | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const groups = await requireBackendData(
    serverApiClient.GET('/api/v1/user-groups', {
      headers: authorizationHeader(session.token),
    })
  );

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h4" component="h1">
          グループ管理
        </Typography>
        <CreateGroupField />
      </Stack>
      <Suspense fallback={null}>
        <Groups groups={groups} />
      </Suspense>
    </Stack>
  );
};

export default Home;
