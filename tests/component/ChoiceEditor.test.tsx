import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import ChoiceEditor from '@/app/(protected)/admin/forms/_components/ChoiceEditor';
import { createEmptyFormEditorValues } from '@/app/(protected)/admin/forms/_lib/formEditorDefaults';
import type { FormEditorValues } from '@/app/(protected)/admin/forms/_schema/formEditorSchema';

import { renderWithProviders, screen } from './render';

const ChoiceEditorExample = () => {
  const { control, register } = useForm<FormEditorValues>({
    defaultValues: createEmptyFormEditorValues(),
  });

  return (
    <ChoiceEditor control={control} register={register} questionIndex={0} />
  );
};

describe('ChoiceEditor', () => {
  it('質問種別に合わせて選択肢入力を追加・削除する', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChoiceEditorExample />);

    expect(screen.getByRole('button', { name: '選択肢の追加' })).toBeDisabled();

    await user.click(screen.getByRole('combobox', { name: /質問の種類/ }));
    await user.click(screen.getByRole('option', { name: '単一選択' }));

    expect(screen.getByRole('textbox', { name: '選択肢1' })).toBeVisible();
    expect(screen.getByRole('button', { name: '選択肢の追加' })).toBeEnabled();

    await user.type(screen.getByRole('textbox', { name: '選択肢1' }), 'はい');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('textbox', { name: '選択肢2' })).toBeVisible();

    await user.click(screen.getByRole('combobox', { name: /質問の種類/ }));
    await user.click(screen.getByRole('option', { name: 'テキスト' }));

    expect(screen.queryByRole('textbox', { name: '選択肢1' })).toBeNull();
    expect(screen.getByRole('button', { name: '選択肢の追加' })).toBeDisabled();
  });
});
