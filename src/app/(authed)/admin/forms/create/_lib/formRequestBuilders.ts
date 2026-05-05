import type { paths } from '@/generated/api-types';
import type { Form } from '../_schema/createFormSchema';

type CreateFormBody =
  paths['/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  paths['/forms/{id}']['put']['requestBody']['content']['application/json'];
type FormLabelsUpdateBody =
  paths['/forms/{form_id}/labels']['put']['requestBody']['content']['application/json'];

const mapQuestion = (question: Form['questions'][number]) => {
  if (question.question_type === 'Text') {
    return {
      title: question.title,
      description: question.description,
      question_type: question.question_type,
      is_required: question.is_required,
      position: question.position,
      template_key: question.template_key,
    };
  }
  return {
    title: question.title,
    description: question.description,
    question_type: question.question_type,
    is_required: question.is_required,
    position: question.position,
    template_key: question.template_key,
    choices: question.choices.map((choice, index) => ({
      label: choice.choice,
      position: index,
    })),
  };
};

export const toCreateFormBody = (data: Form): CreateFormBody => ({
  title: data.title,
  description: data.description,
  questions: data.questions.map(mapQuestion),
});

export const toFormUpdateBody = (
  data: Form,
  includeQuestions: boolean
): FormUpdateBody => {
  const start_at = data.settings.response_period.start_at;
  const end_at = data.settings.response_period.end_at;

  const body: FormUpdateBody = {
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

  if (includeQuestions) {
    body.questions = data.questions.map(mapQuestion);
  }

  return body;
};

export const toFormLabelsUpdateBody = (data: Form): FormLabelsUpdateBody => ({
  labels: data.labels.map((label) => label.id),
});
