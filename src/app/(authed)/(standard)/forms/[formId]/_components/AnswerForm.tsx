'use client';

import { Alert } from '@mui/material';
import type { GetQuestionsResponse } from '@/lib/api-types';
import AnswerSubmissionForm from './AnswerSubmissionForm';
import AnswerSubmissionSuccess from './AnswerSubmissionSuccess';
import { useAnswerSubmission } from './useAnswerSubmission';

interface Props {
  questions: GetQuestionsResponse;
  formId: string;
  title: string;
  description: string;
}

/**
 * 回答画面から見た entry point。
 * 入力中と送信完了後の画面切り替えだけを持ち、詳細責務は下位へ委譲する。
 */
const AnswerForm = ({ questions, formId, title, description }: Props) => {
  const {
    isSubmitted,
    submissionErrorCode,
    submitAnswers,
    resetSubmissionState,
  } = useAnswerSubmission(formId);

  if (isSubmitted) {
    return <AnswerSubmissionSuccess onReset={resetSubmissionState} />;
  }

  return (
    <>
      {submissionErrorCode === 'OUT_OF_PERIOD' && (
        <Alert
          severity="error"
          sx={{ width: '100%', maxWidth: 800, mx: 'auto', mb: 2 }}
        >
          回答期間が終了しています
        </Alert>
      )}
      <AnswerSubmissionForm
        questions={questions}
        title={title}
        description={description}
        onSubmitAnswers={submitAnswers}
      />
    </>
  );
};

export default AnswerForm;
