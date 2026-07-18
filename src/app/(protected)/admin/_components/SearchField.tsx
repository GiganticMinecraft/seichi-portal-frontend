'use client';

import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  toSearchResultRows,
  SEARCH_RESULT_CATEGORY_COLOR,
  type SearchResultRow,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const SEARCH_DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 8;

const SearchField = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed === '') {
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedValue(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const isSuggesting = debouncedValue !== '';

  const { data } = useApiQuery(
    '/api/v1/search',
    isSuggesting ? { query: { query: debouncedValue } } : null,
    { keepPreviousData: true }
  );

  const options =
    isSuggesting && data
      ? toSearchResultRows(data).slice(0, SUGGESTION_LIMIT)
      : [];

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (value.trim() === '') {
      setDebouncedValue('');
    }
  };

  const goToSearchPage = (value: string) => {
    if (value.trim() === '') {
      return;
    }
    router.push(`/admin/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <Paper
      sx={(theme) => ({
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        backgroundColor: alpha(theme.palette.common.white, 0.85),
        border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        }),
      })}
    >
      <IconButton
        sx={{ p: '10px', color: 'text.primary' }}
        aria-label="search"
        onClick={() => {
          goToSearchPage(searchValue);
        }}
      >
        <SearchIcon />
      </IconButton>
      <Autocomplete<SearchResultRow, false, false, true>
        freeSolo
        fullWidth
        options={options}
        filterOptions={(x) => x}
        inputValue={searchValue}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.title
        }
        onInputChange={(_event, value, reason) => {
          if (reason === 'input') {
            handleInputChange(value);
          }
        }}
        onChange={(_event, value) => {
          if (!value) {
            return;
          }
          if (typeof value === 'string') {
            goToSearchPage(value);
            return;
          }
          router.push(value.url);
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Stack
              {...optionProps}
              key={key}
              component="li"
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', width: '100%' }}
            >
              <Chip
                label={option.category}
                color={SEARCH_RESULT_CATEGORY_COLOR[option.category]}
                size="small"
                variant="outlined"
              />
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {option.title}
              </Typography>
            </Stack>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Search..."
            slotProps={{
              ...params.slotProps,
              input: { ...params.slotProps.input, disableUnderline: true },
              htmlInput: {
                ...params.slotProps.htmlInput,
                'aria-label': 'search...',
              },
            }}
            sx={{ ml: 1, flex: 1 }}
          />
        )}
      />
    </Paper>
  );
};

export default SearchField;
