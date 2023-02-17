import React, { type Dispatch, type SetStateAction } from 'react';

import { McProfile } from '../types';

export const mcProfile = React.createContext<McProfile | undefined>(undefined);
export const setMcProfile = React.createContext<
  Dispatch<SetStateAction<McProfile>>
>(() => undefined);
