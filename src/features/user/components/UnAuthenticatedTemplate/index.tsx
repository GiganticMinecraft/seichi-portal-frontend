import { Presenter, PresenterProps } from './presenter';

import { useMcProfile } from '../../hooks';

type Props = Omit<PresenterProps, 'isAuthenticated'>;

export const UnAuthenticatedTemplate = ({ children }: Props) => {
  const { isMcProfile: isAuthenticated } = useMcProfile();

  return <Presenter {...{ isAuthenticated }}>{children}</Presenter>;
};
