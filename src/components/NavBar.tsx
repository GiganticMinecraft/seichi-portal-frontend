import MenuIcon from '@mui/icons-material/Menu';
import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { UserIconButton } from '@/features/user/components/UserIconButton';
import { Link } from './Link';
import { AuthenticatedTemplate } from '../features/user/components/AuthenticatedTemplate';
import { SigninButton } from '../features/user/components/SigninButton';
import { SignoutButton } from '../features/user/components/SignoutButton';
import { UnauthenticatedTemplate } from '../features/user/components/UnauthenticatedTemplate';

const NavBar = () => {
  return (
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
            <Link href="/" color="#fff">
              Seichi Portal
            </Link>
          </Typography>
          <AuthenticatedTemplate>
            <UserIconButton />
            <SignoutButton />
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
