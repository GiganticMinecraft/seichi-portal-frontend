'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { formatString } from '@/generic/DateFormatter';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { useRelatedAnswerActions } from '@/hooks/useRelatedAnswerActions';
import type { AnswerSearchResponse } from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

import { AnswerPublicationChip } from './AnswerMeta';
import AnswerStatusChip from './AnswerStatusChip';

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
  const { search, debouncedSearch, handleSearchChange } = useDebouncedSearch();
  const { addRelatedAnswer } = useRelatedAnswerActions(formId, answerId);

  const { data, isLoading } = useApiQuery(
    '/api/v1/search/answers',
    debouncedSearch === '' ? null : { query: { query: debouncedSearch } },
    { keepPreviousData: true }
  );

  const excluded = new Set([answerId, ...excludedAnswerIds]);
  const options = (data?.answers ?? []).filter(
    (answer) => !excluded.has(answer.id)
  );

  const noOptionsText =
    search.trim() === ''
      ? 'キーワードを入力すると候補が表示されます'
      : '該当する回答が見つかりません';

  return (
    <Autocomplete<SearchedAnswer>
      options={options}
      loading={isLoading}
      loadingText="検索中..."
      noOptionsText={noOptionsText}
      filterOptions={(options) => options}
      inputValue={search}
      onInputChange={(_event, value) => {
        handleSearchChange(value);
      }}
      getOptionLabel={(option) => resolveAnswerTitle(option.title)}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      value={null}
      onChange={(_event, option) => {
        if (option === null) {
          return;
        }
        handleSearchChange('');
        void addRelatedAnswer(option.form_id, option.id);
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Stack spacing={0.5} sx={{ width: '100%', py: 0.5 }}>
              <Typography variant="body2">
                {resolveAnswerTitle(option.title)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <AnswerStatusChip status={option.status} />
                <AnswerPublicationChip publication={option.publication} />
                <Typography variant="caption" color="textSecondary">
                  {formatString(option.timestamp)}
                </Typography>
              </Stack>
            </Stack>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="関連付ける回答を検索" size="small" />
      )}
      sx={{ minWidth: 280 }}
    />
  );
};

export default AdminRelatedAnswerAdder;
