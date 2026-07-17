import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ArchivedFormRowMenu from '@/app/(protected)/admin/forms/_components/FormsList/ArchivedFormRowMenu';

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
  restoreForm: ReturnType<
    typeof vi.fn<(formId: string) => Promise<{ ok: boolean }>>
  >;
};

const formActionsMocks = vi.hoisted<FormActionsMocks>(() => ({
  restoreForm: vi.fn<(formId: string) => Promise<{ ok: boolean }>>(),
}));

vi.mock('@/hooks/useFormActions', () => ({
  useFormActions: () => ({
    archiveForm: vi.fn(),
    restoreForm: formActionsMocks.restoreForm,
  }),
}));

describe('ArchivedFormRowMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('復元確認中はダイアログのボタンを無効化し、完了するとダイアログが閉じる', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = deferred<{ ok: boolean }>();
    formActionsMocks.restoreForm.mockReturnValue(promise);

    renderWithProviders(<ArchivedFormRowMenu formId="form-1" />);

    await user.click(
      screen.getByRole('button', { name: 'アーカイブ済みフォーム操作メニュー' })
    );
    await user.click(screen.getByRole('menuitem', { name: '復元' }));

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '復元' }));

    await waitFor(() => {
      expect(formActionsMocks.restoreForm).toHaveBeenCalledTimes(1);
    });
    expect(formActionsMocks.restoreForm).toHaveBeenCalledWith('form-1');

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', { name: '復元' })
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
