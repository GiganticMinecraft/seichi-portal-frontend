import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { useMcProfile } from './mcProfile';

export const useSignOut = () => {
  const { instance } = useMsal();
  const [isSigningOut, { on: startSignOut, off: endSignOut }] =
    useBoolean(false);
  const { setMcProfile } = useMcProfile();
  const signOut = async () => {
    startSignOut();
    // TODO: catch error
    await instance.logoutPopup().finally(() => endSignOut());

    setMcProfile(undefined);
  };

  return { signOut, isSigningOut };
};
