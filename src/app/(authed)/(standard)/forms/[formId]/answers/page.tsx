'use client';

import { Box, Typography } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerList from './_components/AnswerList';

const Home = ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = use(params);
  const {
    data: answers,
    error: answersError,
    isLoading: isLoadingAnswers,
  } = useApiQuery('/forms/{id}/answers', {
    path: { id: formId },
  });
  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useApiQuery('/forms');

  if (answersError || formsError) {
    return <ErrorModal error={answersError ?? formsError} />;
  }

  if (isLoadingAnswers || isLoadingForms || !answers || !forms) {
    return <LoadingCircular />;
  }

  const formTitle =
    forms.find((form) => form.id === answers[0]?.form_id)?.title ??
    'unknown form';

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {formTitle}
      </Typography>
      <AnswerList answers={answers} />
    </Box>
  );
};

export default Home;
