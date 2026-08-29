'use client';

import CloseIcon from '@mui/icons-material/Close';
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
import { useState } from 'react';

import {
  toSearchResultRows,
  SEARCH_RESULT_CATEGORY_COLOR,
  type SearchResultRow,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

const SUGGESTION_LIMIT = 8;

const SearchField = () => {
  const router = useRouter();
  const [isExpandedOnMobile, setIsExpandedOnMobile] = useState(false);
  const {
    search: searchValue,
    debouncedSearch: debouncedValue,
    isSearching: isSuggesting,
    handleSearchChange: handleInputChange,
  } = useDebouncedSearch();

  const { data } = useApiQuery(
    '/api/v1/search',
    isSuggesting ? { query: { query: debouncedValue } } : null,
    { keepPreviousData: true }
  );

  const options =
    isSuggesting && data
      ? toSearchResultRows(data).slice(0, SUGGESTION_LIMIT)
      : [];

  const goToSearchPage = (value: string) => {
    if (value.trim() === '') {
      return;
    }
    router.push(`/admin/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <>
      <IconButton
        aria-label="検索欄を開く"
        onClick={() => {
          setIsExpandedOnMobile(true);
        }}
        sx={{
          display: {
            xs: isExpandedOnMobile ? 'none' : 'inline-flex',
            sm: 'none',
          },
          color: 'inherit',
        }}
      >
        <SearchIcon />
      </IconButton>
      <Paper
        suppressHydrationWarning
        sx={(theme) => ({
          p: '2px 4px',
          display: { xs: isExpandedOnMobile ? 'flex' : 'none', sm: 'flex' },
          alignItems: 'center',
          width: { xs: 'auto', sm: 260, md: 400 },
          minWidth: 0,
          backgroundColor: alpha(theme.palette.common.white, 0.85),
          border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
          ...theme.applyStyles('dark', {
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          }),
          // モバイル幅で展開中は、AppBar 全体を覆って検索欄だけを表示する
          // (タイトルやアイコン類との重なり・はみ出しを避けるため)
          ...(isExpandedOnMobile && {
            [theme.breakpoints.down('sm')]: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              zIndex: 1,
              borderRadius: 0,
              border: 'none',
              backgroundColor: theme.palette.primary.main,
            },
          }),
        })}
      >
        <IconButton
          sx={(theme) => ({
            p: '10px',
            color: 'text.primary',
            ...(isExpandedOnMobile && {
              [theme.breakpoints.down('sm')]: {
                color: theme.palette.primary.contrastText,
              },
            }),
          })}
          aria-label="検索"
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
          getOptionKey={(option) =>
            typeof option === 'string' ? option : option.id
          }
          onInputChange={(_event, value, reason) => {
            if (reason === 'input' || reason === 'clear') {
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
                  key="category"
                  label={option.category}
                  color={SEARCH_RESULT_CATEGORY_COLOR[option.category]}
                  size="small"
                  variant="outlined"
                />
                <Typography
                  key="title"
                  component="span"
                  variant="body2"
                  noWrap
                  sx={{ flex: 1 }}
                >
                  {option.title}
                </Typography>
              </Stack>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="検索内容を入力"
              slotProps={{
                ...params.slotProps,
                input: { ...params.slotProps.input, disableUnderline: true },
                htmlInput: {
                  ...params.slotProps.htmlInput,
                  'aria-label': '検索内容を入力',
                  suppressHydrationWarning: true,
                },
              }}
              sx={(theme) => ({
                ml: 1,
                flex: 1,
                ...(isExpandedOnMobile && {
                  [theme.breakpoints.down('sm')]: {
                    '& .MuiInputBase-input': {
                      color: theme.palette.primary.contrastText,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: alpha(theme.palette.primary.contrastText, 0.7),
                      opacity: 1,
                    },
                  },
                }),
              })}
            />
          )}
        />
        <IconButton
          aria-label="検索欄を閉じる"
          onClick={() => {
            setIsExpandedOnMobile(false);
          }}
          sx={(theme) => ({
            display: { xs: 'inline-flex', sm: 'none' },
            p: '10px',
            color: theme.palette.primary.contrastText,
          })}
        >
          <CloseIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default SearchField;
