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
  /** フォームの回答詳細公開設定 (RESTRICTED) により非表示にされている場合は undefined */
  date: string | undefined;
  labels: GetAnswerLabelsResponse | undefined;
  status: AnswerStatus | undefined;
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
    date:
      answer.timestamp !== undefined
        ? formatString(answer.timestamp)
        : undefined,
    labels: answer.labels,
    status: answer.status,
  }));
