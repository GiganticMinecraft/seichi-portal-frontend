'use client';

import SearchIcon from '@mui/icons-material/Search';
import { Paper, IconButton, InputBase } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import SearchResult from './SearchResult';

const SearchField = () => {
  const [openSearchResultModal, setOpenSearchResultModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.15)
            : alpha(theme.palette.common.white, 0.85),
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? `1px solid ${alpha(theme.palette.common.white, 0.2)}`
            : `1px solid ${alpha(theme.palette.common.white, 0.4)}`,
      }}
    >
      <IconButton
        sx={{ p: '10px', color: 'text.primary' }}
        aria-label="search"
        onClick={() => setOpenSearchResultModal(true)}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search...' }}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setOpenSearchResultModal(true);
          }
        }}
      />
      {openSearchResultModal && (
        <SearchResult
          searchContent={searchValue}
          openState={openSearchResultModal}
          onClose={() => setOpenSearchResultModal(false)}
        />
      )}
    </Paper>
  );
};

export default SearchField;
