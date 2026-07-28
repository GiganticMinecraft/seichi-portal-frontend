import type {
  GetAnswerLabelsResponse,
  GetFormAnswersResponse,
} from '@/lib/api-types';

export interface AnswerListFilter {
  labels: GetAnswerLabelsResponse;
}

export const filterAnswers = (
  answers: GetFormAnswersResponse,
  filter: AnswerListFilter
): GetFormAnswersResponse => {
  if (filter.labels.length === 0) {
    return answers;
  }

  return answers.filter((answer) =>
    filter.labels.every((label) =>
      answer.labels.some((answerLabel) => answerLabel.id === label.id)
    )
  );
};
