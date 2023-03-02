import { Presenter, type PresenterProps } from './presenter';

import { useSignIn } from '../../hooks';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningIn'>;

export const SignIn = ({ ...props }: Props) => {
  const { signIn: onClick, isSigningIn } = useSignIn();

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningIn, onClick }} />;
};
