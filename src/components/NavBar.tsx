import MenuIcon from '@mui/icons-material/Menu';
import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { AuthenticatedTemplate } from './AuthenticatedTemplate';
import { Link } from './link';
import { SigninButton } from './SigninButton';
import { SignoutButton } from './SignoutButton';
import { UnauthenticatedTemplate } from './UnauthenticatedTemplate';

export default function NavBar() {
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
            <SignoutButton />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <SigninButton />
          </UnauthenticatedTemplate>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
