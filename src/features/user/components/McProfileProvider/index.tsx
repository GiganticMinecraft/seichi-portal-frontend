import { useState } from 'react';

import { Presenter, type PresenterProps } from './presenter';

import { McProfile } from '../../types';

type Props = Pick<PresenterProps, 'children'>;

export const McProfileProvider = ({ children }: Props) => {
  const [profile, setProfile] = useState<McProfile | undefined>(undefined);

  return <Presenter {...{ profile, setProfile }}>{children}</Presenter>;
};
