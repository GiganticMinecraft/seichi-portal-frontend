import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

import { useSetMcProfile } from '../../hooks';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningOut'>;

export const SignOut = ({ ...props }: Props) => {
  const { instance } = useMsal();
  const [isSigningOut, { on: startSignOut, off: endSignOut }] =
    useBoolean(false);
  const setMcProfile = useSetMcProfile();
  const onClick = async () => {
    startSignOut();
    // TODO: catch error
    await instance
      .logoutPopup({
        postLogoutRedirectUri: '/signin',
        mainWindowRedirectUri: '/signin',
      })
      .finally(() => endSignOut());

    setMcProfile(undefined);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningOut, onClick }} />;
};
