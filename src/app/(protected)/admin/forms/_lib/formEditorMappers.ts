import {
  fromStringToJSTDateTime,
  toApiDateTime,
} from '@/generic/DateFormatter';
import type { ApiComponents, ApiPaths, GetFormResponse } from '@/lib/api/types';
import type {
  FormEditorQuestion,
  FormEditorValues,
  FormVisibility,
} from '../_schema/formEditorSchema';

type CreateFormBody =
  ApiPaths['/api/v1/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  ApiPaths['/api/v1/forms/{id}']['put']['requestBody']['content']['application/json'];

const toVisibility = (value: string | null | undefined): FormVisibility =>
  value === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';

const toNullableNonEmptyString = (
  value: string | null | undefined
): string | null => {
  const trimmed = value?.trim();

  return trimmed || null;
};

const toTemplateKey = (value: string, index: number): string => {
  const trimmed = value.trim();

  return trimmed === '' ? `question_${index + 1}` : trimmed;
};

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
): ApiComponents['schemas']['QuestionSchema'] => {
  const base: ApiComponents['schemas']['QuestionDefinitionSchema'] = {
    title: question.title.trim(),
    description: toNullableNonEmptyString(question.description),
    is_required: question.is_required,
    position: index,
    template_key: toTemplateKey(question.template_key, index),
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
      label: choice.choice.trim(),
      position: choiceIndex,
    })),
  };
};

export const fromFormResponseToEditorValues = (
  form: GetFormResponse
): FormEditorValues => {
  const startAt = form.settings.answer_settings?.acceptance_period?.start_at;
  const endAt = form.settings.answer_settings?.acceptance_period?.end_at;

  return {
    title: form.title,
    description: form.description,
    questions: form.questions.map(toEditorQuestion),
    labels: form.labels,
    settings: {
      has_acceptance_period: Boolean(startAt && endAt),
      acceptance_period: {
        start_at: startAt ? fromStringToJSTDateTime(startAt) : null,
        end_at: endAt ? fromStringToJSTDateTime(endAt) : null,
      },
      discord_webhook_url: form.settings.discord_webhook_url ?? null,
      visibility: toVisibility(form.settings.visibility),
      default_answer_title:
        form.settings.answer_settings?.default_answer_title ?? null,
      answer_visibility: toVisibility(
        form.settings.answer_settings?.visibility
      ),
      allow_temporary_answers: form.settings.allow_temporary_answers ?? false,
    },
  };
};

export const toCreateFormBody = (data: FormEditorValues): CreateFormBody => ({
  title: data.title.trim(),
  description: data.description,
  questions: data.questions.map((question, index) =>
    toApiQuestion(question, index)
  ),
});

export const toFormUpdateBody = (
  data: FormEditorValues,
  includeQuestions: boolean
): FormUpdateBody => {
  const startAt = data.settings.acceptance_period.start_at;
  const endAt = data.settings.acceptance_period.end_at;

  const body: FormUpdateBody = {
    title: data.title.trim(),
    description: data.description,
    labels: data.labels.map((label) => label.id),
    settings: {
      visibility: data.settings.visibility,
      allow_temporary_answers: data.settings.allow_temporary_answers,
      discord_webhook_url: toNullableNonEmptyString(
        data.settings.discord_webhook_url
      ),
      answer_settings: {
        default_answer_title:
          data.settings.default_answer_title === ''
            ? null
            : data.settings.default_answer_title,
        acceptance_period: data.settings.has_acceptance_period
          ? {
              start_at: toApiDateTime(startAt),
              end_at: toApiDateTime(endAt),
            }
          : {
              start_at: null,
              end_at: null,
            },
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
