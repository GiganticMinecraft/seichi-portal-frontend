import { useMsal } from '@azure/msal-react';
import { useBoolean, useToast } from '@chakra-ui/react';
import { isOk, unwrapOk, unwrapErr } from 'option-t/lib/PlainResult';

import { defaultToastOptions } from '@/config';

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
        status: 'success',
        title: 'サインインに成功しました',
        description: `ようこそ、${profile.name}さん`,
      });
      setMcProfile(profile);

      return;
    }

    await signOut();

    const error = unwrapErr(profileResult);
    toast({
      ...defaultToastOptions,
      status: 'error',
      title: 'サインイン中にエラーが発生したため、サインアウトしました',
      description: error.message,
    });
  };
  const signIn = async () => {
    startSignIn();
    await doSignIn().finally(() => endSignIn());
  };

  return { signIn, isSigningIn };
};
