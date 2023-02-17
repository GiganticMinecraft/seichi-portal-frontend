import { useContext } from 'react';

import { mcProfile, setMcProfile } from '../stores';

export const useMcProfile = () => useContext(mcProfile);
export const useSetMcProfile = () => useContext(setMcProfile);
