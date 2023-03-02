import { useMsal } from '@azure/msal-react';
import { useBoolean, useToast, UseToastOptions } from '@chakra-ui/react';
import { isOk, unwrapOk, unwrapErr } from 'option-t/lib/PlainResult';

import { defaultToastOptions } from '@/config';
import { BaseError } from '@/types';

import { useMcProfile } from './mcProfile';
import { useSignOut } from './signOut';

import { loginAndGetGameProfile } from '../api';

export const useSignIn = () => {
  const { instance } = useMsal();
  const [isSigningIn, { on: startSignIn, off: endSignIn }] = useBoolean(false);
  const { signOut } = useSignOut();
  const { setMcProfile } = useMcProfile();
  const toast = useToast();
  const doSignIn = async () => {
    const profileResult = await loginAndGetGameProfile(instance);

    if (isOk(profileResult)) {
      const profile = unwrapOk(profileResult);
      toast({
        ...defaultToastOptions,
        title: 'サインインに成功しました',
        description: `ようこそ、${profile.name}さん`,
        status: 'success',
      });
      setMcProfile(profile);

      return;
    }

    const error = unwrapErr(profileResult);
    const errorToastOptions: UseToastOptions = {
      ...defaultToastOptions,
      status: 'error',
      title: 'サインイン中にエラーが発生しました',
    };

    await signOut();

    if (error instanceof BaseError) {
      toast({
        ...errorToastOptions,
        description: error.message,
      });
    } else {
      toast({
        ...errorToastOptions,
        description: `${error.name}(${error.message})`,
      });
      throw error;
    }
  };
  const signIn = async () => {
    startSignIn();
    await doSignIn().finally(() => endSignIn());
  };

  return { signIn, isSigningIn };
};
