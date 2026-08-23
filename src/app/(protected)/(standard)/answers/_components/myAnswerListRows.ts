import { formatString } from '@/generic/DateFormatter';
import type {
  AnswerStatus,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

export type MyAnswerListRow = {
  id: string;
  formId: string;
  title: string;
  date: string;
  labels: GetAnswerLabelsResponse;
  status: AnswerStatus;
};

export const toMyAnswerListRows = (
  answers: GetAnswersResponse
): MyAnswerListRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    formId: answer.form_id,
    title: resolveAnswerTitle(answer.title),
    date: formatString(answer.timestamp),
    labels: answer.labels,
    status: answer.status,
  }));
