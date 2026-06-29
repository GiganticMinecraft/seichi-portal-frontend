'use client';

import { useMemo, useState } from 'react';

import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

import { filterForms } from '../_lib/formListFilters';

export const useFormListFilters = (forms: GetFormsResponse) => {
  const [titleSearch, setTitleSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);
  const filteredForms = useMemo(
    () => filterForms(forms, { titleSearch, labels: labelFilter }),
    [forms, titleSearch, labelFilter]
  );

  return {
    titleSearch,
    setTitleSearch,
    setLabelFilter,
    filteredForms,
  };
};
