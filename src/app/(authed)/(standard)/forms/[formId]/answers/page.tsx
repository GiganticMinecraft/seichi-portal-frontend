import { Box, Typography } from '@mui/material';
import AnswerList from './_components/AnswerList';
import { backendFetchJson } from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { GetFormAnswersResponse, GetFormResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '回答一覧 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await requireUser();
  const { formId } = await params;
  const [answers, form] = await Promise.all([
    backendFetchJson<GetFormAnswersResponse>(`/forms/${formId}/answers`, {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<GetFormResponse>(`/forms/${formId}`, {
      method: 'GET',
      token: session.token,
    }),
  ]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {form.title}
      </Typography>
      <AnswerList answers={answers} />
    </Box>
  );
};

export default Home;
