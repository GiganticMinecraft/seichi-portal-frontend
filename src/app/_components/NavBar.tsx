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
  IconButton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import {
  useOptionalCurrentUser,
  useOptionalThemeMode,
} from '@/app/(authed)/theme/themeMode';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeModeToggle = () => {
  const themeMode = useOptionalThemeMode();

  if (!themeMode) {
    return null;
  }

  const { mode, toggleMode } = themeMode;

  return (
    <Tooltip
      title={
        mode === 'light' ? 'ダークテーマに切り替え' : 'ライトテーマに切り替え'
      }
    >
      <IconButton
        color="inherit"
        onClick={toggleMode}
        aria-label="toggle theme"
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

const NavBar = () => {
  const user = useOptionalCurrentUser();
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
          {!user ? (
            <SigninButton />
          ) : (
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
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
