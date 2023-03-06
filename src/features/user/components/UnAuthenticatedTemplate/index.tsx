import { Presenter, PresenterProps } from './presenter';

import { useMcProfile } from '../../hooks';

type Props = Omit<PresenterProps, 'isAuthenticated'>;

export const UnauthenticatedTemplate = ({ children }: Props) => {
  const { isMcProfile: isAuthenticated } = useMcProfile();

  return <Presenter {...{ isAuthenticated }}>{children}</Presenter>;
};
