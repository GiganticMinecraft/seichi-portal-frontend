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
import useSWR from 'swr';
import type { GetUsersResponse } from '@/app/api/_schemas/ResponseSchemas';

const SearchField = () => {
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
      <IconButton sx={{ p: '10px', color: '#FFFFFF' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search...' }}
      />
    </Paper>
  );
};

const NavBar = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR<GetUsersResponse>('/api/users', fetcher);

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
          <Avatar
            alt="PlayerHead"
            src={data ? `https://mc-heads.net/avatar/${data.uuid}` : ''}
            sx={{ marginLeft: '20px' }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
