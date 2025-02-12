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
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import { MsalProvider } from './MsalProvider';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import type {
  ErrorResponse,
  GetUsersResponse,
} from '../api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const NavBar = () => {
  const { data } =
    useSWR<Either<ErrorResponse, GetUsersResponse>>('/api/proxy/users');
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);

  return (
    <MsalProvider>
      <Box sx={{ flexGrow: 1 }}>
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
              <Link href="/" color="#fff" sx={{ textDecoration: 'none' }}>
                Seichi Portal
              </Link>
            </Typography>
            <AuthenticatedTemplate>
              {data?._tag === 'Right' ? (
                <Avatar
                  alt="PlayerHead"
                  src={
                    data ? `https://mc-heads.net/avatar/${data.right.uuid}` : ''
                  }
                  sx={{ marginLeft: '20px' }}
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    setAnchorEl(event.currentTarget)
                  }
                />
              ) : null}
              <Menu
                anchorEl={anchorEl}
                open={anchorEl !== undefined}
                onClose={() => setAnchorEl(undefined)}
              >
                <MenuItem>
                  <SignoutButton />
                </MenuItem>
              </Menu>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <SigninButton />
            </UnauthenticatedTemplate>
          </Toolbar>
        </AppBar>
      </Box>
    </MsalProvider>
  );
};

export default NavBar;
