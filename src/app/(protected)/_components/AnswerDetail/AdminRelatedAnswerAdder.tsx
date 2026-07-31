'use client';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useRelatedAnswerActions } from '@/hooks/useRelatedAnswerActions';
import type { AnswerSearchResponse } from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

const SEARCH_DEBOUNCE_MS = 300;

type SearchedAnswer = AnswerSearchResponse['answers'][number];

const AdminRelatedAnswerAdder = ({
  formId,
  answerId,
  excludedAnswerIds,
}: {
  formId: string;
  answerId: string;
  excludedAnswerIds: string[];
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { addRelatedAnswer } = useRelatedAnswerActions(formId, answerId);

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === '') {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim() === '') {
      setDebouncedSearch('');
    }
  };

  const { data, isLoading } = useApiQuery(
    '/api/v1/search/answers',
    debouncedSearch === '' ? null : { query: { query: debouncedSearch } },
    { keepPreviousData: true }
  );

  const excluded = new Set([answerId, ...excludedAnswerIds]);
  const options = (data?.answers ?? []).filter(
    (answer) => !excluded.has(answer.id)
  );

  return (
    <Autocomplete<SearchedAnswer>
      options={options}
      loading={isLoading}
      filterOptions={(options) => options}
      inputValue={search}
      onInputChange={(_event, value) => {
        handleSearchChange(value);
      }}
      getOptionLabel={(option) => resolveAnswerTitle(option.title)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      value={null}
      onChange={(_event, option) => {
        if (option === null) {
          return;
        }
        handleSearchChange('');
        void addRelatedAnswer(option.form_id, option.id);
      }}
      renderInput={(params) => (
        <TextField {...params} label="関連付ける回答を検索" size="small" />
      )}
      sx={{ minWidth: 280 }}
    />
  );
};

export default AdminRelatedAnswerAdder;
