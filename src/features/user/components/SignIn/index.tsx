import { useMsal } from '@azure/msal-react';
import { useBoolean, useToast, UseToastOptions } from '@chakra-ui/react';
import { isOk, unwrapErr, unwrapOk } from 'option-t/lib/PlainResult';

import { defaultToastOptions } from '@/libs';

import { Presenter, type PresenterProps } from './presenter';

import { loginAndGetGameProfile } from '../../api';
import { useSetMcProfile } from '../../hooks';
import { MsAccountOwnsNoMcAccount } from '../../types';

type Props = Omit<PresenterProps, 'onClick' | 'isSigningIn'>;

export const SignIn = ({ ...props }: Props) => {
  const [isSigningIn, { on: startSignIn, off: endSignIn }] = useBoolean(false);
  const { instance } = useMsal();
  const setMcProfile = useSetMcProfile();
  const toast = useToast();
  const onClick = async () => {
    startSignIn();
    // TODO: MSアカウントはあるが、MCアカウントがない場合に注意する
    // NOTE: だからといってすぐサインアウトすると、リロードされてしまう
    const profileResult = await loginAndGetGameProfile(instance).finally(() =>
      endSignIn(),
    );

    if (isOk(profileResult)) {
      const profile = unwrapOk(profileResult);
      toast({
        ...defaultToastOptions,
        title: 'サインインに成功しました',
        description: `ようこそ、${profile.name}さん`,
        status: 'success',
      });
      setMcProfile(profile);

      return;
    }

    const error = unwrapErr(profileResult);
    const errorToastOptions: UseToastOptions = {
      ...defaultToastOptions,
      status: 'error',
      title: 'サインイン中にエラーが発生しました',
    };

    if (error instanceof MsAccountOwnsNoMcAccount) {
      toast({
        ...errorToastOptions,
        description: error.message,
      });
    } else {
      toast({
        ...errorToastOptions,
        description: `${error.name}(${error.message})`,
      });
      throw error;
    }
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ isSigningIn, onClick }} />;
};
