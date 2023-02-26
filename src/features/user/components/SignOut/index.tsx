import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

import { useMcProfile } from '../../hooks';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningOut'>;

export const SignOut = ({ ...props }: Props) => {
  const { instance } = useMsal();
  const [isSigningOut, { on: startSignOut, off: endSignOut }] =
    useBoolean(false);
  const { setMcProfile } = useMcProfile();
  const onClick = async () => {
    startSignOut();
    // TODO: catch error
    await instance
      .logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      })
      .finally(() => endSignOut());

    setMcProfile(undefined);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningOut, onClick }} />;
};
