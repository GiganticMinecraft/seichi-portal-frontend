import { describe, expect, it } from 'vitest';

import { formEditorQuestionSchema } from '@/app/(protected)/admin/forms/_schema/formEditorSchema';
import type { FormEditorQuestion } from '@/app/(protected)/admin/forms/_schema/formEditorSchema';

const baseQuestion: FormEditorQuestion = {
  identity: { kind: 'new' },
  title: 'Question title',
  description: '',
  question_type: 'Text',
  choices: [],
  is_required: false,
  position: 0,
  template_key: '',
};

const parseTemplateKey = (templateKey: string) =>
  formEditorQuestionSchema.safeParse({
    ...baseQuestion,
    template_key: templateKey,
  });

describe('formEditorQuestionSchema template_key', () => {
  it('allows an empty template_key', () => {
    expect(parseTemplateKey('').success).toBe(true);
  });

  it('allows ASCII alphanumeric, underscore and hyphen', () => {
    expect(parseTemplateKey('answer-1_key').success).toBe(true);
  });

  it('allows a key at the 255 character limit', () => {
    expect(parseTemplateKey('a'.repeat(255)).success).toBe(true);
  });

  it('rejects a key over the 255 character limit', () => {
    expect(parseTemplateKey('a'.repeat(256)).success).toBe(false);
  });

  it('rejects characters outside ASCII alphanumeric/_/-', () => {
    expect(parseTemplateKey('質問キー').success).toBe(false);
    expect(parseTemplateKey('key with space').success).toBe(false);
  });

  it.each(['username', 'form_name'])(
    'rejects the reserved word "%s"',
    (reserved) => {
      expect(parseTemplateKey(reserved).success).toBe(false);
    }
  );
});
