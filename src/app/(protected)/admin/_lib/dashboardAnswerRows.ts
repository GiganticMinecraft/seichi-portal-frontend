import { formatString } from '@/generic/DateFormatter';
import type {
  AnswerStatus,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

export type DashboardAnswerRow = {
  id: string;
  formId: string;
  category: string;
  title: string;
  date: string;
  labels: GetAnswerLabelsResponse;
  status: AnswerStatus;
};

const UNKNOWN_FORM_TITLE = 'unknown form';

export const toDashboardAnswerRows = (
  answers: GetAnswersResponse,
  formTitleById: ReadonlyMap<string, string>
): DashboardAnswerRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    formId: answer.form_id,
    category: formTitleById.get(answer.form_id) ?? UNKNOWN_FORM_TITLE,
    title: resolveAnswerTitle(answer.title),
    date: formatString(answer.timestamp),
    labels: answer.labels,
    status: answer.status,
  }));
