import { match } from 'ts-pattern';

import {
  fromStringToJSTDateTime,
  toApiDateTime,
} from '@/generic/DateFormatter';
import type { ApiComponents, ApiPaths, GetFormResponse } from '@/lib/api/types';

import type {
  AcceptancePeriodSetting,
  FormEditorQuestion,
  FormEditorQuestionIdentity,
  FormEditorValues,
  FormVisibility,
} from '../_schema/formEditorSchema';

type CreateFormBody =
  ApiPaths['/api/v1/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  ApiPaths['/api/v1/forms/{id}']['put']['requestBody']['content']['application/json'];

const toVisibility = (value: string | null | undefined): FormVisibility =>
  value === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';

const toNullableNonEmptyString = (value: string): string | null => {
  const trimmed = value.trim();

  return trimmed || null;
};

const toTemplateKey = (value: string, index: number): string => {
  const trimmed = value.trim();

  return trimmed === '' ? `question_${index + 1}` : trimmed;
};

const toEditorQuestionIdentity = (
  id: string | null | undefined
): FormEditorQuestionIdentity =>
  id ? { kind: 'existing', id } : { kind: 'new' };

const toApiQuestionId = (
  identity: FormEditorQuestionIdentity
): string | null => (identity.kind === 'existing' ? identity.id : null);

const toEditorQuestion = (
  question: GetFormResponse['questions'][number]
): FormEditorQuestion => ({
  identity: toEditorQuestionIdentity(question.id),
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
    id: toApiQuestionId(question.identity),
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
        startAt: fromStringToJSTDateTime(startAt),
        endAt: fromStringToJSTDateTime(endAt),
      }
    : { kind: 'none' };

export const fromFormResponseToEditorValues = (
  form: GetFormResponse
): FormEditorValues => {
  const startAt = form.settings.answer_settings.acceptance_period.start_at;
  const endAt = form.settings.answer_settings.acceptance_period.end_at;

  return {
    title: form.title,
    description: form.description,
    questions: form.questions.map(toEditorQuestion),
    labels: form.labels,
    settings: {
      acceptance_period: toAcceptancePeriodSetting(startAt, endAt),
      discord_webhook_url: form.settings.discord_webhook_url ?? '',
      visibility: toVisibility(form.settings.visibility),
      default_answer_title:
        form.settings.answer_settings.default_answer_title ?? '',
      answer_visibility: toVisibility(form.settings.answer_settings.visibility),
      allow_temporary_answers: form.settings.allow_temporary_answers,
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
    .with({ kind: 'specified' }, ({ startAt, endAt }) => ({
      start_at: toApiDateTime(startAt),
      end_at: toApiDateTime(endAt),
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
        default_answer_title: toNullableNonEmptyString(
          data.settings.default_answer_title
        ),
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
