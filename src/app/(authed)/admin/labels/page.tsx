import { Stack, Typography } from '@mui/material';
import { Suspense } from 'react';
import LabelsTabs from './_components/LabelsTabs';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type {
  GetAnswerLabelsResponse,
  GetFormLabelsResponse,
} from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ラベル管理 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const [formLabels, answerLabels] = await Promise.all([
    backendFetchJson<GetFormLabelsResponse>('/labels/forms', {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<GetAnswerLabelsResponse>('/labels/answers', {
      method: 'GET',
      token: session.token,
    }),
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
