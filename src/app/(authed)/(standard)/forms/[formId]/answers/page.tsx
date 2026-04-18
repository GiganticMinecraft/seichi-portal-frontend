'use client';

import { Box } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerList from './_components/AnswerList';
import type { GetFormAnswersResponse, GetFormsResponse } from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ formId: number }> }) => {
  const { formId } = use(params);
  const {
    data: answers,
    error: answersError,
    isLoading: isLoadingAnswers,
  } = useSWR<GetFormAnswersResponse>(`/api/proxy/forms/${formId}/answers`);
  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useSWR<GetFormsResponse>('/api/proxy/forms');

  if (answersError || formsError) {
    return <ErrorModal error={answersError ?? formsError} />;
  }

  if (isLoadingAnswers || isLoadingForms || !answers || !forms) {
    return <LoadingCircular />;
  }

  return (
    <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <AnswerList
        formTitle={
          forms.find((form) => form.id === answers[0]?.form_id)?.title ??
          'unknown form'
        }
        answers={answers}
      />
    </Box>
  );
};

export default Home;
