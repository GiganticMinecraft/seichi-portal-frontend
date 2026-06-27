import { Box, Typography } from '@mui/material';
import FormList from './_components/FormList';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム一覧 | Seichi Portal',
};

const Home = async () => {
  const session = await requireUser();
  const forms = await requireBackendData(
    serverApiClient.GET('/api/v1/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        フォーム一覧
      </Typography>
      <FormList forms={forms} />
    </Box>
  );
};

export default Home;
