'use client';

import { Container, Stack } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import InputMessageField from './_components/InputMessageField';
import Messages from './_components/Messages';
import type {
  ErrorResponse,
  GetMessagesResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { answerId: number } }) => {
  const { data: messages, isLoading: isMessagesLoading } = useSWR<
    Either<ErrorResponse, GetMessagesResponse>
  >(`/api/proxy/forms/answers/${params.answerId}/messages`, {
    refreshInterval: 1000,
  });

  if (!messages) {
    return <LoadingCircular />;
  } else if ((!isMessagesLoading && !messages) || messages._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
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
        <Messages messages={messages.right} answerId={params.answerId} />
      </Container>
      <InputMessageField answer_id={params.answerId} />
    </Stack>
  );
};

export default Home;
