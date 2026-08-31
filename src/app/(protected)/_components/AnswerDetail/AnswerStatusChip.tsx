import { Chip } from '@mui/material';

import RedactedNotice from '@/app/_components/RedactedNotice';
import type { AnswerStatus } from '@/lib/api-types';
import {
  ANSWER_STATUS_COLOR,
  ANSWER_STATUS_LABEL,
} from '@/lib/forms/answerStatus';

const AnswerStatusChip = ({ status }: { status: AnswerStatus | undefined }) =>
  status === undefined ? (
    <RedactedNotice />
  ) : (
    <Chip
      label={ANSWER_STATUS_LABEL[status]}
      color={ANSWER_STATUS_COLOR[status]}
      size="small"
    />
  );

export default AnswerStatusChip;
