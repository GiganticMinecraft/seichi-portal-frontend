'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Link,
  Avatar,
  Menu,
  MenuItem,
  ListItemText,
} from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import ThemeModeToggle from '@/app/(authed)/_components/ThemeModeToggle';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const NavBar = () => {
  const { data } = useApiQuery('/users/me');
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              component={NextLink}
              href="/"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              Seichi Portal
            </Link>
          </Typography>
          <ThemeModeToggle />
          <AuthenticatedTemplate>
            {data ? (
              <Box>
                <Avatar
                  alt="PlayerHead"
                  src={data ? `https://mc-heads.net/avatar/${data.id}` : ''}
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
                      href={`/users/${data.id}`}
                      color="inherit"
                      sx={{ textDecoration: 'none' }}
                    >
                      <ListItemText>ユーザー情報・設定変更</ListItemText>
                    </Link>
                  </MenuItem>
                </Menu>
              </Box>
            ) : null}
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <SigninButton />
          </UnauthenticatedTemplate>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
