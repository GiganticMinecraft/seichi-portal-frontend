'use client';

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Link,
  Avatar,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import ThemeModeToggle from '@/app/(authed)/_components/ThemeModeToggle';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import { useSession } from '@/hooks/useSession';

const NavBar = () => {
  const { state, user } = useSession();
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Image
            src="/favicon.ico"
            width={48}
            height={48}
            alt="seichi-portal logo"
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              component={NextLink}
              href="/"
              color="inherit"
              sx={{ textDecoration: 'none', pl: '10px' }}
            >
              Seichi Portal
            </Link>
          </Typography>
          <ThemeModeToggle />
          {state === 'loading' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <CircularProgress color="inherit" size={24} />
            </Box>
          ) : null}
          {state === 'authenticated' && user ? (
            <Box>
              <Avatar
                alt="PlayerHead"
                src={`https://mc-heads.net/avatar/${user.id}`}
                sx={{ marginLeft: '20px' }}
                onClick={(event: React.MouseEvent<HTMLElement>) =>
                  setAnchorEl(event.currentTarget)
                }
              />
              <Menu
                anchorEl={anchorEl}
                open={anchorEl !== undefined}
                onClose={() => setAnchorEl(undefined)}
              >
                <MenuItem>
                  <SignoutButton />
                </MenuItem>
                <MenuItem>
                  <Link
                    component={NextLink}
                    href={`/users/${user.id}`}
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    <ListItemText>ユーザー情報・設定変更</ListItemText>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
          {state === 'unauthenticated' ? <SigninButton /> : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
