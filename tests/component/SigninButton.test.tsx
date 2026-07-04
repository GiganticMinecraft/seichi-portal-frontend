import { InteractionStatus } from '@azure/msal-browser';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SigninButton } from '@/app/_components/SigninButton';

import { act, fireEvent, renderWithProviders, screen, waitFor } from './render';

const loginRedirectMock = vi.hoisted<
  ReturnType<typeof vi.fn<(request: unknown) => Promise<void>>>
>(() => vi.fn<(request: unknown) => Promise<void>>());

// 実際のMSALでは`inProgress`は`MsalProvider`のContextを介して
// アプリ全体で共有される単一の状態であり、AppBarのSigninButtonと
// ランディング中央のボタンなど、複数の`useMsal()`呼び出し元が
// 同じ値を参照している。これをコンポーネントローカルな`useState`で
// 再現すると、それぞれの呼び出し元が独立したstateを持ってしまい、
// 「片方をクリックしたらもう片方も無効化される」という連動を
// 検証できない。そこでモジュールスコープの外部ストア
// (useSyncExternalStore相当のパターン)を使い、
// `setGlobalInProgress`で更新すると購読中のすべての`useMsal()`呼び出し元が
// 再レンダリングされ、同じ`inProgress`を受け取るようにする。
type Listener = () => void;

const globalMsalState = vi.hoisted<{
  current: InteractionStatus;
  listeners: Set<Listener>;
}>(() => ({
  // vi.hoisted内のコードは通常のimport文より先に評価されるため、
  // ここでは`@azure/msal-browser`からimportした`InteractionStatus`を
  // 参照できない。実体は文字列リテラルの列挙値なので、直接'none'を使う。
  current: 'none',
  listeners: new Set<Listener>(),
}));

const setGlobalInProgress = (status: InteractionStatus) => {
  globalMsalState.current = status;
  globalMsalState.listeners.forEach((listener) => {
    listener();
  });
};

vi.mock('@azure/msal-react', () => ({
  useMsal: () => {
    const [, forceRender] = useState(0);
    useEffect(() => {
      const listener = () => {
        forceRender((count) => count + 1);
      };
      globalMsalState.listeners.add(listener);
      return () => {
        globalMsalState.listeners.delete(listener);
      };
    }, []);
    return {
      instance: { loginRedirect: loginRedirectMock },
      inProgress: globalMsalState.current,
    };
  },
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
    setGlobalInProgress(InteractionStatus.None);
  });

  it('loginRedirect解決前は連打を防ぎ、rejectした後は再度サインインできる', async () => {
    const firstAttempt: Deferred<void> = createDeferred();
    // 実際のMSALはloginRedirect呼び出しと同時にinProgressをLoginへ遷移させる。
    // isLoggingInはinstance側のstateではなくこの共有inProgressから導出されるため、
    // ここでその遷移を模す。
    loginRedirectMock.mockImplementationOnce(() => {
      setGlobalInProgress(InteractionStatus.Login);
      return firstAttempt.promise;
    });
    const user = userEvent.setup();

    renderWithProviders(<SigninButton />);
    const button = screen.getByRole('button', { name: 'サインイン' });

    // クリック直後、loginRedirectが未解決(inProgressがLoginのまま)の間は
    // ボタンがdisabledになり、連打してもloginRedirectは1回しか呼ばれない。
    await user.click(button);
    expect(button).toBeDisabled();
    expect(loginRedirectMock).toHaveBeenCalledTimes(1);

    // ボタンはネイティブのdisabled属性で無効化されているため、
    // 連打(再度のclickイベント)が発生してもhandlerは呼ばれない。
    fireEvent.click(button);
    expect(loginRedirectMock).toHaveBeenCalledTimes(1);

    // loginRedirectがrejectすると、実際のMSALはinProgressをNoneへ戻す。
    // それにより(グローバル状態を共有する)ボタンが再度有効になる。
    await act(async () => {
      firstAttempt.reject(new Error('redirect failed'));
      setGlobalInProgress(InteractionStatus.None);
      await firstAttempt.promise.catch(() => undefined);
    });
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    // 再クリックでloginRedirectを呼び直せる(サインインできなくなる回帰の防止)。
    const secondAttempt: Deferred<void> = createDeferred();
    loginRedirectMock.mockImplementationOnce(() => {
      setGlobalInProgress(InteractionStatus.Login);
      return secondAttempt.promise;
    });

    await user.click(button);
    expect(loginRedirectMock).toHaveBeenCalledTimes(2);
    expect(button).toBeDisabled();
  });

  it('AppBarとランディング中央、別々にマウントされたサインインボタン同士が連動して無効化・再有効化される', async () => {
    const attempt: Deferred<void> = createDeferred();
    loginRedirectMock.mockImplementationOnce(() => {
      setGlobalInProgress(InteractionStatus.Login);
      return attempt.promise;
    });
    const user = userEvent.setup();

    // 同一画面に同時表示される、AppBarのSigninButtonと
    // ランディング中央のサインインボタンを模して2つマウントする。
    // 両者は同じ`useMsal()`のグローバルな`inProgress`を参照するため、
    // 片方をクリックすればもう片方も連動して無効化されるはず。
    renderWithProviders(
      <>
        <SigninButton />
        <SigninButton />
      </>
    );
    const [appBarButton, landingButton] = screen.getAllByRole('button', {
      name: 'サインイン',
    });
    if (!appBarButton || !landingButton) {
      throw new Error('サインインボタンが2つ見つかりませんでした。');
    }

    // AppBar側をクリックすると、ランディング中央側もdisabledになる。
    await user.click(appBarButton);
    expect(appBarButton).toBeDisabled();
    expect(landingButton).toBeDisabled();
    expect(loginRedirectMock).toHaveBeenCalledTimes(1);

    // loginRedirectがrejectしてinProgressがNoneに戻ると、両方とも再度有効になる。
    await act(async () => {
      attempt.reject(new Error('redirect failed'));
      setGlobalInProgress(InteractionStatus.None);
      await attempt.promise.catch(() => undefined);
    });
    await waitFor(() => {
      expect(appBarButton).not.toBeDisabled();
      expect(landingButton).not.toBeDisabled();
    });
  });
});
