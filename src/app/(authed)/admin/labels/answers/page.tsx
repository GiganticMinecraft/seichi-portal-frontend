import { Stack, Typography } from '@mui/material';
import CreateLabelField from '../_components/CreateLabelField';
import Labels from '../_components/Labels';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetAnswerLabelsResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '回答設定用ラベル管理 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const labels = await backendFetchJson<GetAnswerLabelsResponse>(
    '/labels/answers',
    {
      method: 'GET',
      token: session.token,
    }
  );

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h4">回答設定用ラベル管理</Typography>
        <CreateLabelField />
      </Stack>
      <Labels labels={labels} />
    </Stack>
  );
};

export default Home;
