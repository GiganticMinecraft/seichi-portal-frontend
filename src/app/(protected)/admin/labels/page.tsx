import { Stack, Typography } from '@mui/material';
import { Suspense } from 'react';
import LabelsTabs from './_components/LabelsTabs';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ラベル管理 | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const [formLabels, answerLabels] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/labels/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/labels/answers', {
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1">
        ラベル管理
      </Typography>
      <Suspense fallback={null}>
        <LabelsTabs formLabels={formLabels} answerLabels={answerLabels} />
      </Suspense>
    </Stack>
  );
};

export default Home;
