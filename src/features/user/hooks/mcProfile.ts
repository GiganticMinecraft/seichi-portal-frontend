import { useContext } from 'react';

import {
  mcProfile as mcProfileContext,
  setMcProfile as setMcProfileContext,
} from '../stores';

export const useMcProfile = () => {
  const mcProfile = useContext(mcProfileContext);
  const setMcProfile = useContext(setMcProfileContext);
  const isMcProfile = !!mcProfile;

  return { mcProfile, setMcProfile, isMcProfile };
};
