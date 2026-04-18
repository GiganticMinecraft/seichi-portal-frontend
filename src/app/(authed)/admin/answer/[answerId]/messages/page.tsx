'use client';

import { Container, CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import InputMessageField from './_components/InputMessageField';
import Messages from './_components/Messages';
import adminDashboardTheme from '../../../theme/adminDashboardTheme';
import type { GetAnswerResponse, GetMessagesResponse } from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ answerId: number }> }) => {
  const { answerId } = use(params);
  const {
    data: answer,
    error: answerError,
    isLoading: isAnswerLoading,
  } = useSWR<GetAnswerResponse>(`/api/proxy/forms/answers/${answerId}`);
  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
  } = useSWR<GetMessagesResponse>(
    answer
      ? `/api/proxy/forms/${answer.form_id}/answers/${answerId}/messages`
      : null,
    { refreshInterval: 1000 }
  );

  if (!answer || !messages) {
    return <LoadingCircular />;
  } else if (
    (!isAnswerLoading && answerError) ||
    (!isMessagesLoading && messagesError)
  ) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack
        sx={{
          width: 'calc(100% - 240px)', // Subtract Drawer width
          height: 'calc(100vh - 64px)', // Subtract AppBar height
          overflow: 'hidden',
          position: 'fixed',
          top: '64px', // Add AppBar height
          left: '240px', // Add Drawer width
          margin: 0,
        }}
      >
        <Container
          style={{
            width: '100%',
            height: 'calc(100vh - 100px)',
            overflow: 'auto',
            paddingBottom: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          ref={(el) => {
            if (el) {
              el.scrollTop = el.scrollHeight;
            }
          }}
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Messages
            messages={messages}
            formId={answer.form_id}
            answerId={answerId}
          />
        </Container>
        <InputMessageField form_id={answer.form_id} answer_id={answerId} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
