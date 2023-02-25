import { useMcProfile } from '@/features/user/hooks';

import { Presenter } from './presenter';

export const Header = () => {
  const profile = useMcProfile();
  const isAuthenticated = !!profile;

  return <Presenter {...{ isAuthenticated }} />;
};
