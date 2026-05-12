'use client';

import { useEffect } from 'react';

const SITE_TITLE = 'Seichi Portal';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  }, [title]);
};
