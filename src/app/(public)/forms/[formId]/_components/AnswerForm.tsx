'use client';

import { Alert, Box, Stack, Typography } from '@mui/material';
import { formatString } from '@/generic/DateFormatter';
import { SigninButton } from '@/app/_components/SigninButton';
import type { GetQuestionsResponse } from '@/lib/api-types';
import AnswerSubmissionForm from './AnswerSubmissionForm';
import AnswerSubmissionSuccess from './AnswerSubmissionSuccess';
import { useAnswerSubmission } from './useAnswerSubmission';

interface Props {
  questions: GetQuestionsResponse;
  formId: string;
  title: string;
  description: string;
  isAuthenticated: boolean;
  allowTemporaryAnswers: boolean;
}

/**
 * 回答画面から見た entry point。
 * 入力中と送信完了後の画面切り替えだけを持ち、詳細責務は下位へ委譲する。
 */
const AnswerForm = ({
  questions,
  formId,
  title,
  description,
  isAuthenticated,
  allowTemporaryAnswers,
}: Props) => {
  // 未ログインかつフォームが未ログイン回答を許可している場合のみ匿名回答モード。
  const isTemporary = !isAuthenticated && allowTemporaryAnswers;
  const {
    isSubmitted,
    submissionErrorCode,
    restriction,
    submitAnswers,
    resetSubmissionState,
  } = useAnswerSubmission(formId, isTemporary);

  if (isSubmitted) {
    return <AnswerSubmissionSuccess onReset={resetSubmissionState} />;
  }

  // 未ログインで、かつ未ログイン回答も許可されていない場合は回答できない。
  if (!isAuthenticated && !allowTemporaryAnswers) {
    return (
      <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Alert
          severity="info"
          action={<SigninButton />}
          sx={{ alignItems: 'center' }}
        >
          このフォームに回答するにはサインインが必要です。
        </Alert>
      </Box>
    );
  }

  return (
    <Stack spacing={0}>
      {submissionErrorCode === 'OUT_OF_PERIOD' && (
        <Alert
          severity="error"
          sx={{ width: '100%', maxWidth: 800, mx: 'auto', mb: 2 }}
        >
          回答期間が終了しています
        </Alert>
      )}
      {submissionErrorCode === 'RESTRICTED' && (
        <Alert
          severity="error"
          sx={{ width: '100%', maxWidth: 800, mx: 'auto', mb: 2 }}
        >
          現在、回答の投稿が制限されています。
          {restriction?.reason && `（理由: ${restriction.reason}）`}
          {restriction?.expires_at &&
            ` 制限解除予定: ${formatString(restriction.expires_at)}`}
        </Alert>
      )}
      {submissionErrorCode === 'UNKNOWN' && (
        <Alert
          severity="error"
          sx={{ width: '100%', maxWidth: 800, mx: 'auto', mb: 2 }}
        >
          回答の送信に失敗しました。時間をおいて再度お試しください。
        </Alert>
      )}
      <AnswerSubmissionForm
        questions={questions}
        title={title}
        description={description}
        isTemporary={isTemporary}
        onSubmitAnswers={submitAnswers}
      />
    </Stack>
  );
};

export default AnswerForm;
