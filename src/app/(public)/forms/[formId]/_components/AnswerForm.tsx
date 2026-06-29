'use client';

import { Alert, Box, Stack, Typography } from '@mui/material';
import { SigninButton } from '@/app/_components/SigninButton';
import { formatRestrictionExpiration } from '@/lib/restrictions/expiration';
import type { GetQuestionsResponse } from '@/lib/api-types';
import AnswerSubmissionForm from './AnswerSubmissionForm';
import AnswerSubmissionSuccess from './AnswerSubmissionSuccess';
import type { SubmissionState } from './useAnswerSubmission';
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
  const { submissionState, submitAnswers, resetSubmissionState } =
    useAnswerSubmission(formId, isTemporary);

  if (submissionState.kind === 'submitted') {
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
      <SubmissionErrorAlert submissionState={submissionState} />
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

const SubmissionErrorAlert = ({
  submissionState,
}: {
  submissionState: SubmissionState;
}) => {
  if (submissionState.kind !== 'failed') {
    return null;
  }

  const alertSx = { width: '100%', maxWidth: 800, mx: 'auto', mb: 2 };

  switch (submissionState.error.kind) {
    case 'outOfPeriod':
      return (
        <Alert severity="error" sx={alertSx}>
          回答期間が終了しています
        </Alert>
      );
    case 'restricted': {
      const restriction = submissionState.error.restriction;
      return (
        <Alert severity="error" sx={alertSx}>
          現在、回答の投稿が制限されています。
          {restriction && `（理由: ${restriction.reason}）`}
          {restriction?.expiration.kind === 'expiresAt' &&
            ` 制限解除予定: ${formatRestrictionExpiration(
              restriction.expiration
            )}`}
        </Alert>
      );
    }
    case 'unknown':
      return (
        <Alert severity="error" sx={alertSx}>
          回答の送信に失敗しました。時間をおいて再度お試しください。
        </Alert>
      );
  }
};

export default AnswerForm;
