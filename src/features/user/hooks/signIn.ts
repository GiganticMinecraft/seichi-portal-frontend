import { useMsal } from '@azure/msal-react';
import { useBoolean, useToast } from '@chakra-ui/react';
import { isOk, unwrapOk, unwrapErr } from 'option-t/PlainResult';

import { defaultToastOptions } from '@/config';

import { useMcProfile } from './mcProfile';
import { useSignOut } from './signOut';

import { loginAndGetGameProfile } from '../api';

export const useSignIn = () => {
  const { instance } = useMsal();
  const [isSigningIn, { on: startSignIn, off: endSignIn }] = useBoolean(false);
  const { signOut } = useSignOut();
  const { setMcProfile } = useMcProfile();
  const toast = useToast(defaultToastOptions);

  const doSignIn = async () => {
    const profileResult = await loginAndGetGameProfile(instance);

    if (isOk(profileResult)) {
      const profile = unwrapOk(profileResult);
      toast({
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
      status: 'error',
      title: 'サインイン中にエラーが発生したため、サインアウトしました',
      description: error.message,
    });

    if (error.causeError) {
      throw error.causeError;
    }
  };
  const signIn = async () => {
    startSignIn();
    await doSignIn().finally(() => endSignIn());
  };

  return { signIn, isSigningIn };
};
