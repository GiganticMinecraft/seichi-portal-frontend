import type {
  FormEditorQuestion,
  FormEditorValues,
} from '../_schema/formEditorSchema';

export const createEmptyFormEditorQuestion = (): FormEditorQuestion => ({
  identity: { kind: 'new' },
  title: '',
  description: '',
  question_type: 'Text',
  choices: [],
  is_required: false,
  position: 0,
  template_key: '',
});

export const createEmptyFormEditorValues = (): FormEditorValues => ({
  title: '',
  description: '',
  questions: [createEmptyFormEditorQuestion()],
  labels: [],
  settings: {
    acceptance_period: { kind: 'none' },
    discord_webhook_url: '',
    default_answer_title: '',
    visibility: 'PUBLIC',
    answer_visibility: 'PUBLIC',
    allow_temporary_answers: false,
  },
});
