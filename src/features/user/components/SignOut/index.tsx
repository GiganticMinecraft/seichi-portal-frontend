import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningOut'>;

export const SignOut = ({ ...props }: Props) => {
  const { instance } = useMsal();
  const [isSigningOut, { toggle: toggleIsSigningOut }] = useBoolean(false);
  const onClick = async () => {
    toggleIsSigningOut();
    // TODO: catch error
    await instance
      .logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      })
      .finally(() => toggleIsSigningOut());
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningOut, onClick }} />;
};
