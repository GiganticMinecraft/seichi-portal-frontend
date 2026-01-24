'use client';

import { Box } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerList from './_components/AnswerList';
import type {
  ErrorResponse,
  GetFormAnswersResponse,
  GetFormsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: Promise<{ formId: number }> }) => {
  const { formId } = use(params);
  const { data: answers, isLoading: isLoadingAnswers } = useSWR<
    Either<ErrorResponse, GetFormAnswersResponse>
  >(`/api/proxy/forms/${formId}/answers`);
  const { data: forms, isLoading: isLoadingForms } =
    useSWR<Either<ErrorResponse, GetFormsResponse>>('/api/proxy/forms');

  if (!answers || !forms) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingAnswers && !answers) ||
    answers._tag == 'Left' ||
    (!isLoadingForms && !forms) ||
    forms._tag == 'Left'
  ) {
    return <ErrorModal />;
  }

  return (
    <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <AnswerList
        formTitle={
          forms.right.find((form) => form.id === answers.right[0]?.form_id)
            ?.title ?? 'unknown form'
        }
        answers={answers.right}
      />
    </Box>
  );
};

export default Home;
