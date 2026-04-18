'use client';

import { Stack, Typography } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import AnswerMeta from './_components/AnswerMeta';
import Comments from './_components/Comments';
import type {
  AnswerCommentType,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/lib/api-types';

const Home = ({
  params,
}: {
  params: Promise<{ formId: number; answerId: number }>;
}) => {
  const { answerId } = use(params);
  const {
    data: answer,
    error: answerError,
    isLoading: isLoadingAnswers,
  } = useSWR<GetAnswerResponse>(`/api/proxy/forms/answers/${answerId}`, {
    refreshInterval: 1000,
  });

  const {
    data: formQuestions,
    error: formQuestionsError,
    isLoading: isLoadingFormQuestions,
  } = useSWR<GetQuestionsResponse>(
    answer ? `/api/proxy/forms/${answer.form_id}/questions` : null
  );

  if (!answer || !formQuestions) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingAnswers && answerError) ||
    (!isLoadingFormQuestions && formQuestionsError)
  ) {
    return <ErrorModal />;
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="space-between"
      spacing={4}
      sx={{ width: '100%' }}
    >
      <Typography variant="h4">{answer.title}</Typography>
      <AnswerMeta answer={answer} />
      <AnswerDetails answer={answer} questions={formQuestions} />
      <Comments
        comments={answer.comments as AnswerCommentType[]}
        formId={answer.form_id}
        answerId={answer.id}
        inputSx={{
          '& .MuiInputBase-input': { color: 'white' },
          '& label': { color: 'white' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
          },
        }}
      />
    </Stack>
  );
};

export default Home;
