import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FormRowMenu from '@/app/(protected)/admin/forms/_components/FormRowMenu';

import { renderWithProviders, screen, waitFor, within } from './render';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type FormActionsMocks = {
  archiveForm: ReturnType<
    typeof vi.fn<(formId: string) => Promise<{ ok: boolean }>>
  >;
};

const formActionsMocks = vi.hoisted<FormActionsMocks>(() => ({
  archiveForm: vi.fn<(formId: string) => Promise<{ ok: boolean }>>(),
}));

vi.mock('@/hooks/useFormActions', () => ({
  useFormActions: () => ({
    archiveForm: formActionsMocks.archiveForm,
    restoreForm: vi.fn(),
  }),
}));

describe('FormRowMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('アーカイブ確認中はダイアログのボタンを無効化し、完了するとダイアログが閉じる', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<{ ok: boolean }>();
    formActionsMocks.archiveForm.mockReturnValue(promise);

    renderWithProviders(<FormRowMenu formId="form-1" />);

    await user.click(
      screen.getByRole('button', { name: 'フォーム操作メニュー' })
    );
    await user.click(screen.getByRole('menuitem', { name: 'アーカイブ' }));

    const dialog = screen.getByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'アーカイブ' })
    );

    await waitFor(() => {
      expect(formActionsMocks.archiveForm).toHaveBeenCalledTimes(1);
    });
    expect(formActionsMocks.archiveForm).toHaveBeenCalledWith('form-1');

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', { name: 'アーカイブ' })
      ).toBeDisabled();
    });
    expect(
      within(dialog).getByRole('button', { name: 'キャンセル' })
    ).toBeDisabled();

    resolve({ ok: true });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
