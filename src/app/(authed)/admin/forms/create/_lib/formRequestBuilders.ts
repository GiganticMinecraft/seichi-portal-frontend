import type { paths } from '@/generated/api-types';
import type { Form } from '../_schema/createFormSchema';

type CreateFormBody =
  paths['/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  paths['/forms/{id}']['patch']['requestBody']['content']['application/json'];
type QuestionsUpdateBody =
  paths['/forms/{id}/questions']['put']['requestBody']['content']['application/json'];
type FormLabelsUpdateBody =
  paths['/forms/{form_id}/labels']['put']['requestBody']['content']['application/json'];

export const toCreateFormBody = (data: Form): CreateFormBody => ({
  title: data.title,
  description: data.description,
});

export const toFormUpdateBody = (data: Form): FormUpdateBody => {
  const start_at = data.settings.response_period.start_at;
  const end_at = data.settings.response_period.end_at;

  return {
    title: data.title,
    description: data.description,
    settings: {
      visibility: data.settings.visibility,
      webhook_url: data.settings.webhook_url,
      answer_settings: {
        default_answer_title:
          data.settings.default_answer_title === ''
            ? null
            : data.settings.default_answer_title,
        response_period: data.settings.has_response_period
          ? {
              start_at: start_at ? `${start_at}:00+09:00` : null,
              end_at: end_at ? `${end_at}:00+09:00` : null,
            }
          : null,
        visibility: data.settings.answer_visibility,
      },
    },
  };
};

export const toQuestionsUpdateBody = (data: Form): QuestionsUpdateBody => ({
  questions: data.questions.map((question) => ({
    ...question,
    choices: question.choices.map((choice) => choice.choice),
  })),
});

export const toFormLabelsUpdateBody = (data: Form): FormLabelsUpdateBody => ({
  labels: data.labels.map((label) => label.id),
});
