'use client';

import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton,
  InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

const SearchField = () => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="search">
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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Image
            src="/favicon.ico"
            width={32}
            height={32}
            alt={'seichi-portal logo'}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/admin" color="#fff" sx={{ textDecoration: 'none' }}>
              Seichi Portal Admin
            </Link>
          </Typography>
          <SearchField />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
