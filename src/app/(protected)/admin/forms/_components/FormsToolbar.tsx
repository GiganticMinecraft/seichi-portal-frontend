'use client';

import { Search } from '@mui/icons-material';
import { Divider, InputAdornment, Stack, TextField } from '@mui/material';
import FormCreateButton from './FormCreateButton';
import FormLabelFilter from './FormLabelFilter';
import ToManageFormLabelButton from './ToManageFormLabelButton';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  labels: GetFormLabelsResponse;
  titleSearch: string;
  onTitleSearchChange: (value: string) => void;
  onLabelFilterChange: Dispatch<SetStateAction<GetFormLabelsResponse>>;
}

const FormsToolbar = ({
  labels,
  titleSearch,
  onTitleSearchChange,
  onLabelFilterChange,
}: Props) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'center', width: '100%' }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flexGrow: 1, minWidth: 0 }}
      >
        <TextField
          variant="standard"
          size="small"
          label="タイトル検索"
          value={titleSearch}
          onChange={(e) => onTitleSearchChange(e.target.value)}
          sx={{ minWidth: 200 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormLabelFilter
          labelOptions={labels}
          setLabelFilter={onLabelFilterChange}
        />
      </Stack>
      <Divider orientation="vertical" flexItem />
      <ToManageFormLabelButton />
      <Divider orientation="vertical" flexItem />
      <FormCreateButton />
    </Stack>
  );
};

export default FormsToolbar;
