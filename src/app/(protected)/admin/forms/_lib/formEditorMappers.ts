import {
  fromStringToJSTDateTime,
  toApiDateTime,
} from '@/generic/DateFormatter';
import type { ApiComponents, ApiPaths, GetFormResponse } from '@/lib/api/types';
import { match } from 'ts-pattern';
import type {
  AcceptancePeriodSetting,
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

const toAcceptancePeriodSetting = (
  startAt: string | null | undefined,
  endAt: string | null | undefined
): AcceptancePeriodSetting =>
  startAt && endAt
    ? {
        kind: 'specified',
        start_at: fromStringToJSTDateTime(startAt),
        end_at: fromStringToJSTDateTime(endAt),
      }
    : { kind: 'none' };

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
      acceptance_period: toAcceptancePeriodSetting(startAt, endAt),
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
  const acceptancePeriod = match(data.settings.acceptance_period)
    .with({ kind: 'specified' }, ({ start_at, end_at }) => ({
      start_at: toApiDateTime(start_at),
      end_at: toApiDateTime(end_at),
    }))
    .with({ kind: 'none' }, () => ({
      start_at: null,
      end_at: null,
    }))
    .exhaustive();

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
        acceptance_period: acceptancePeriod,
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
