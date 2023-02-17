import { useMsal } from '@azure/msal-react';
import { useBoolean } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

import { loginAndGetGameProfile } from '../../api';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningIn'>;

export const SignIn = ({ ...props }: Props) => {
  const [isSigningIn, { on: startSignIn, off: endSignIn }] = useBoolean(false);
  const { instance } = useMsal();
  const onClick = async () => {
    startSignIn();
    // TODO: 格納する
    // TODO: MSアカウントはあるが、MCアカウントがない場合に注意する
    // NOTE: だからといってすぐサインアウトすると、リロードされてしまう
    await loginAndGetGameProfile(instance).finally(() => endSignIn());
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningIn, onClick }} />;
};
