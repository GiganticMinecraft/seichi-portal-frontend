import { Dispatch, SetStateAction } from 'react';

import { mcProfile, setMcProfile } from '../../stores';
import { McProfile } from '../../types';

export type PresenterProps = {
  children: React.ReactNode;
  profile?: McProfile;
  setProfile: Dispatch<SetStateAction<McProfile>>;
};

export const Presenter = ({
  children,
  profile,
  setProfile,
}: PresenterProps) => (
  <mcProfile.Provider value={profile}>
    <setMcProfile.Provider value={setProfile}>{children}</setMcProfile.Provider>
  </mcProfile.Provider>
);
