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
import Image from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import SearchResult from './SearchResult';
import type {
  ErrorResponse,
  GetUsersResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import NotificationsIcon from '@mui/icons-material/Notifications';
import type { Either } from 'fp-ts/lib/Either';

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
        background: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <IconButton
        sx={{ p: '10px', color: '#FFFFFF' }}
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
  const { data } =
    useSWR<Either<ErrorResponse, GetUsersResponse>>('/api/users');

  if (data?._tag === 'Left') {
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
            <Link href="/admin" color="#fff" sx={{ textDecoration: 'none' }}>
              Seichi Portal Admin
            </Link>
          </Typography>
          <SearchField />
          <IconButton color="primary" sx={{ marginLeft: '20px' }}>
            <NotificationsIcon />
          </IconButton>
          <Avatar
            alt="PlayerHead"
            src={data ? `https://mc-heads.net/avatar/${data.right.uuid}` : ''}
            sx={{ marginLeft: '20px' }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
