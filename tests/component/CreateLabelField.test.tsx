import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CreateLabelField from '@/app/(protected)/_components/CreateLabelField';

import { renderWithProviders, screen, waitFor } from './render';

vi.mock('@/hooks/useLabelCRUD', () => ({
  useLabelCRUD: () => ({ createLabel: vi.fn() }),
}));

describe('CreateLabelField', () => {
  it('作成ダイアログを開くとラベル名の入力欄へフォーカスする', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateLabelField labelType="answers" />);

    await user.click(screen.getByRole('button', { name: '新規作成' }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'ラベル名' })).toHaveFocus();
    });
  });
});
