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
  ListItemIcon,
  ListItemAvatar,
  ListItem,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useOptionalCurrentUser,
  useOptionalThemeMode,
} from '@/app/(authed)/theme/themeMode';
import { SigninButton } from './SigninButton';
import { getMsalInstance } from './MsalProvider';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

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

type UserMenuProps = {
  user: NonNullable<ReturnType<typeof useOptionalCurrentUser>>;
};

const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    if (isSigningOut) return;
    setAnchorEl(null);
    setIsSigningOut(true);

    try {
      await fetch('/api/logout', { method: 'DELETE' });

      const msalInstance = getMsalInstance();
      await msalInstance.initialize();
      const [account] = msalInstance.getAllAccounts();

      if (account) {
        await msalInstance.logoutRedirect({
          account,
          postLogoutRedirectUri: '/',
        });
        return;
      }

      router.push('/');
    } catch (e) {
      console.error('Failed to sign out:', e);
      setIsSigningOut(false);
    }
  };

  return (
    <Box sx={{ ml: '20px' }}>
      <Tooltip title="メニューを開く">
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-controls={anchorEl ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
          color="inherit"
          sx={{ p: 0.5 }}
          disabled={isSigningOut}
        >
          <Avatar
            alt="PlayerHead"
            src={`https://mc-heads.net/avatar/${user.id}`}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListItem sx={{ py: 1, px: 2 }}>
          <ListItemAvatar>
            <Avatar src={`https://mc-heads.net/avatar/${user.id}`} />
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            slotProps={{
              primary: {
                variant: 'body2',
                noWrap: true,
                component: 'span',
                sx: { fontWeight: 'bold' },
              },
            }}
          />
        </ListItem>
        <Divider />
        <MenuItem
          component={NextLink}
          href={`/users/${user.id}`}
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ユーザー情報・設定変更</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSignout} disabled={isSigningOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>サインアウト</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const NavBar = () => {
  const user = useOptionalCurrentUser();

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
          {!user ? <SigninButton /> : <UserMenu user={user} />}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
