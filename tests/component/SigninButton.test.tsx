import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SigninButton } from '@/app/_components/SigninButton';

import { fireEvent, renderWithProviders, screen, waitFor } from './render';

const loginRedirectMock = vi.hoisted<
  ReturnType<typeof vi.fn<(request: unknown) => Promise<void>>>
>(() => vi.fn<(request: unknown) => Promise<void>>());

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ instance: { loginRedirect: loginRedirectMock } }),
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('SigninButton', () => {
  beforeEach(() => {
    loginRedirectMock.mockReset();
  });

  it('loginRedirect解決前は連打を防ぎ、rejectした後は再度サインインできる', async () => {
    const firstAttempt: Deferred<void> = createDeferred();
    loginRedirectMock.mockReturnValueOnce(firstAttempt.promise);
    const user = userEvent.setup();

    renderWithProviders(<SigninButton />);
    const button = screen.getByRole('button', { name: 'サインイン' });

    // クリック直後、loginRedirectが未解決の間はボタンがdisabledになり、
    // 連打してもloginRedirectは1回しか呼ばれない。
    await user.click(button);
    expect(button).toBeDisabled();
    expect(loginRedirectMock).toHaveBeenCalledTimes(1);

    // ボタンはネイティブのdisabled属性で無効化されているため、
    // 連打(再度のclickイベント)が発生してもhandlerは呼ばれない。
    fireEvent.click(button);
    expect(loginRedirectMock).toHaveBeenCalledTimes(1);

    // loginRedirectがrejectすると、ボタンが再度有効になる。
    firstAttempt.reject(new Error('redirect failed'));
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    // 再クリックでloginRedirectを呼び直せる(サインインできなくなる回帰の防止)。
    const secondAttempt: Deferred<void> = createDeferred();
    loginRedirectMock.mockReturnValueOnce(secondAttempt.promise);

    await user.click(button);
    expect(loginRedirectMock).toHaveBeenCalledTimes(2);
    expect(button).toBeDisabled();
  });
});
