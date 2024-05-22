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
} from '@mui/material';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import { MsalProvider } from '@/features/user/components/MsalProvider';

const NavBar = () => {
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
              <SignoutButton />
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
