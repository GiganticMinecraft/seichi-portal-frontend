import { useMcProfile } from '@/features/user/hooks';

import { Presenter } from './presenter';

export const Header = () => {
  const { isMcProfile: isAuthenticated } = useMcProfile();

  return <Presenter {...{ isAuthenticated }} />;
};
