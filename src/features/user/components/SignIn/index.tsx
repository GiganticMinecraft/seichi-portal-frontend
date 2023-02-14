import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

import { loginRequest } from '../../config/msal';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningIn'>;

export const SignIn = ({ ...props }: Props) => {
  const [isSigningIn, { toggle: toggleIsSigningInt }] = useBoolean(false);
  const { instance } = useMsal();
  const onClick = async () => {
    toggleIsSigningInt();
    // TODO: catch error
    await instance.loginPopup(loginRequest).finally(() => toggleIsSigningInt());
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningIn, onClick }} />;
};
