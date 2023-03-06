import { AuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useBoolean, useToast } from '@chakra-ui/react';

import { defaultToastOptions } from '@/config/chakra';

import { useMcProfile } from './mcProfile';

import { MicrosoftAuthenticationLibError } from '../types/error';

export const useSignOut = () => {
  const { instance } = useMsal();
  const [isSigningOut, { on: startSignOut, off: endSignOut }] =
    useBoolean(false);
  const { setMcProfile } = useMcProfile();
  const toast = useToast(defaultToastOptions);
  const signOut = async () => {
    startSignOut();
    await instance
      .logoutPopup()
      .then(() => {
        toast({
          status: 'success',
          title: 'サインアウトに成功しました',
        });
        setMcProfile(undefined);
      })
      .catch((e: Error) => {
        if (e instanceof AuthError) {
          const error = new MicrosoftAuthenticationLibError(e);

          toast({
            status: 'error',
            title: 'サインアウト中にエラーが発生しました',
            description: error.message,
          });
        }

        throw e;
      })
      .finally(() => endSignOut());
  };

  return { signOut, isSigningOut };
};
