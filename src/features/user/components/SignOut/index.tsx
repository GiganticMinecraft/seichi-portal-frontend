import { Presenter, type PresenterProps } from './presenter';

import { useSignOut } from '../../hooks/signOut';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningOut'>;

export const SignOut = ({ ...props }: Props) => {
  const { signOut: onClick, isSigningOut } = useSignOut();

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningOut, onClick }} />;
};
