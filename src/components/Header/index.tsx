import { useIsAuthenticated } from '@azure/msal-react';

import { Presenter } from './presenter';

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();

  return <Presenter {...{ isAuthenticated }} />;
};
