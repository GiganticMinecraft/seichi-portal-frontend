'use client';

import SearchIcon from '@mui/icons-material/Search';
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton,
  InputBase,
  Avatar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import ThemeModeToggle from '@/app/(authed)/_components/ThemeModeToggle';
import ErrorModal from '@/app/_components/ErrorModal';
import { useApiQuery } from '@/app/_swr/useApiQuery';
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
          alpha(
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black,
            theme.palette.mode === 'dark' ? 0.15 : 0.06
          ),
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

const NavBar = () => {
  const { data, error } = useApiQuery('/users/me');

  if (error) {
    return <ErrorModal />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) => theme.palette.secondary.main,
        }}
      >
        <Toolbar>
          <Image
            src="/favicon.ico"
            width={48}
            height={48}
            alt={'seichi-portal logo'}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, paddingLeft: '10px' }}
          >
            <Link
              component={NextLink}
              href="/admin"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              Seichi Portal Admin
            </Link>
          </Typography>
          <SearchField />
          <ThemeModeToggle />
          <Avatar
            alt="PlayerHead"
            src={data ? `https://mc-heads.net/avatar/${data.id}` : ''}
            sx={{ marginLeft: '20px' }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
