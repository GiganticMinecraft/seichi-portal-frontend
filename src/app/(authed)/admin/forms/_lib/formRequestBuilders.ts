import { toApiDateTime } from '@/generic/DateFormatter';
import type { components, paths } from '@/generated/api-types';

type CreateFormBody =
  paths['/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  paths['/forms/{id}']['put']['requestBody']['content']['application/json'];
type FormLabelsUpdateBody =
  paths['/forms/{form_id}/labels']['put']['requestBody']['content']['application/json'];

type FormLike = {
  title: string;
  description: string;
  questions: {
    title: string;
    description: string;
    question_type: 'Text' | 'SingleChoice' | 'MultipleChoice';
    choices: { choice: string }[];
    is_required: boolean;
    position: number;
    template_key: string;
    id?: string | null;
  }[];
  settings: {
    has_response_period: boolean;
    response_period: { start_at: string | null; end_at: string | null } | null;
    webhook_url: string | null;
    default_answer_title: string | null;
    visibility: 'PUBLIC' | 'PRIVATE';
    answer_visibility: 'PUBLIC' | 'PRIVATE';
  };
};

const mapQuestion = (
  question: FormLike['questions'][number],
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
    const textQuestion: components['schemas']['TextQuestionSchema'] & {
      question_type: 'Text';
    } = {
      ...base,
      question_type: 'Text',
    };
    return textQuestion;
  }

  const selectQuestion: components['schemas']['SelectQuestionSchema'] & {
    question_type: 'SingleChoice' | 'MultipleChoice';
  } = {
    ...base,
    question_type: question.question_type,
    choices: question.choices.map((choice, choiceIndex) => ({
      label: choice.choice,
      position: choiceIndex,
    })),
  };
  return selectQuestion;
};

export const toCreateFormBody = (data: FormLike): CreateFormBody => ({
  title: data.title,
  description: data.description,
  questions: data.questions.map((question, index) =>
    mapQuestion(question, index)
  ),
});

export const toFormUpdateBody = (
  data: FormLike,
  includeQuestions: boolean
): FormUpdateBody => {
  const start_at = data.settings.response_period?.start_at;
  const end_at = data.settings.response_period?.end_at;

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
              start_at: toApiDateTime(start_at),
              end_at: toApiDateTime(end_at),
            }
          : null,
        visibility: data.settings.answer_visibility,
      },
    },
  };

  if (includeQuestions) {
    body.questions = data.questions.map((question, index) =>
      mapQuestion(question, index)
    );
  }

  return body;
};

export const toFormLabelsUpdateBody = (
  labels: { id: string }[]
): FormLabelsUpdateBody => ({
  labels: labels.map((label) => label.id),
});
