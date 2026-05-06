import {
  fromStringToJSTDateTime,
  toApiDateTime,
} from '@/generic/DateFormatter';
import type { components, paths } from '@/generated/api-types';
import type { GetFormResponse } from '@/lib/api/types';
import type {
  FormEditorQuestion,
  FormEditorValues,
  FormVisibility,
} from '../_schema/formEditorSchema';

type CreateFormBody =
  paths['/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  paths['/forms/{id}']['put']['requestBody']['content']['application/json'];
type FormLabelsUpdateBody =
  paths['/forms/{form_id}/labels']['put']['requestBody']['content']['application/json'];

const toVisibility = (value: string | null | undefined): FormVisibility =>
  value === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';

const toEditorQuestion = (
  question: GetFormResponse['questions'][number]
): FormEditorQuestion => ({
  id: question.id ?? null,
  title: question.title,
  description: question.description ?? '',
  question_type: question.question_type,
  choices:
    'choices' in question
      ? question.choices.map((choice) => ({ choice: choice.label }))
      : [],
  is_required: question.is_required,
  position: question.position,
  template_key: question.template_key,
});

const toApiQuestion = (
  question: FormEditorQuestion,
  index: number
): components['schemas']['QuestionSchema'] => {
  const base: components['schemas']['QuestionDefinitionSchema'] = {
    title: question.title,
    description: question.description,
    is_required: question.is_required,
    position: index,
    template_key: question.template_key,
    id: question.id ?? null,
  };

  if (question.question_type === 'Text') {
    return {
      ...base,
      question_type: 'Text',
    };
  }

  return {
    ...base,
    question_type: question.question_type,
    choices: question.choices.map((choice, choiceIndex) => ({
      label: choice.choice,
      position: choiceIndex,
    })),
  };
};

export const fromFormResponseToEditorValues = (
  form: GetFormResponse
): FormEditorValues => {
  const startAt = form.settings.answer_settings?.response_period?.start_at;
  const endAt = form.settings.answer_settings?.response_period?.end_at;

  return {
    title: form.title,
    description: form.description,
    questions: form.questions.map(toEditorQuestion),
    labels: form.labels,
    settings: {
      has_response_period: Boolean(startAt && endAt),
      response_period: {
        start_at: startAt ? fromStringToJSTDateTime(startAt) : null,
        end_at: endAt ? fromStringToJSTDateTime(endAt) : null,
      },
      webhook_url: form.settings.webhook_url ?? null,
      visibility: toVisibility(form.settings.visibility),
      default_answer_title:
        form.settings.answer_settings?.default_answer_title ?? null,
      answer_visibility: toVisibility(
        form.settings.answer_settings?.visibility
      ),
    },
  };
};

export const toCreateFormBody = (data: FormEditorValues): CreateFormBody => ({
  title: data.title,
  description: data.description,
  questions: data.questions.map((question, index) =>
    toApiQuestion(question, index)
  ),
});

export const toFormUpdateBody = (
  data: FormEditorValues,
  includeQuestions: boolean
): FormUpdateBody => {
  const startAt = data.settings.response_period.start_at;
  const endAt = data.settings.response_period.end_at;

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
              start_at: toApiDateTime(startAt),
              end_at: toApiDateTime(endAt),
            }
          : null,
        visibility: data.settings.answer_visibility,
      },
    },
  };

  if (includeQuestions) {
    body.questions = data.questions.map((question, index) =>
      toApiQuestion(question, index)
    );
  }

  return body;
};

export const toFormLabelsUpdateBody = (
  labels: FormEditorValues['labels']
): FormLabelsUpdateBody => ({
  labels: labels.map((label) => label.id),
});
