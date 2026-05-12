'use client';

import { Container, Stack } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import {
  AUTCHED_APP_BAR_HEIGHT_PX,
  AUTCHED_DRAWER_WIDTH_PX,
  AUTCHED_MESSAGE_CONTAINER_OFFSET_PX,
} from '@/app/(authed)/layoutConstants';
import { usePageTitle } from '@/hooks/usePageTitle';
import InputMessageField from './_components/InputMessageField';
import Messages from './_components/Messages';

const Home = ({
  params,
}: {
  params: Promise<{ formId: string; answerId: string }>;
}) => {
  usePageTitle('メッセージ');
  const { formId, answerId } = use(params);
  const {
    data: messages,
    error,
    isLoading: isMessagesLoading,
  } = useApiQuery(
    '/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  if (error) {
    return <ErrorModal />;
  }

  if (isMessagesLoading || !messages) {
    return <LoadingCircular />;
  }

  return (
    <Stack
      sx={{
        width: `calc(100% - ${AUTCHED_DRAWER_WIDTH_PX}px)`,
        height: `calc(100vh - ${AUTCHED_APP_BAR_HEIGHT_PX}px)`,
        overflow: 'hidden',
        position: 'fixed',
        top: `${AUTCHED_APP_BAR_HEIGHT_PX}px`,
        left: `${AUTCHED_DRAWER_WIDTH_PX}px`,
        margin: 0,
      }}
    >
      <Container
        sx={{
          width: '100%',
          height: `calc(100vh - ${AUTCHED_MESSAGE_CONTAINER_OFFSET_PX}px)`,
          overflow: 'auto',
          pb: '20px',
          mx: 'auto',
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
        }}
        ref={(el) => {
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }}
      >
        <Messages messages={messages} formId={formId} answerId={answerId} />
      </Container>
      <InputMessageField form_id={formId} answer_id={answerId} />
    </Stack>
  );
};

export default Home;
