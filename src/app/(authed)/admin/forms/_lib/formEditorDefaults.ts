import type {
  FormEditorQuestion,
  FormEditorValues,
} from '../_schema/formEditorSchema';

export const createEmptyFormEditorQuestion = (): FormEditorQuestion => ({
  id: null,
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
  questions: [],
  labels: [],
  settings: {
    has_acceptance_period: false,
    acceptance_period: {
      start_at: null,
      end_at: null,
    },
    discord_webhook_url: null,
    default_answer_title: null,
    visibility: 'PUBLIC',
    answer_visibility: 'PUBLIC',
  },
});
