'use client';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
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
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import ThemeModeToggle from '@/app/_components/ThemeModeToggle';
import { useOptionalCurrentUser } from '@/app/_providers/currentUser';
import { usePendingAction } from '@/hooks/usePendingAction';

import { getMsalInstance } from './MsalProvider';
import { SigninButton } from './SigninButton';

type UserMenuProps = {
  user: NonNullable<ReturnType<typeof useOptionalCurrentUser>>;
  isAdminPage: boolean;
};

const UserMenu = ({ user, isAdminPage }: UserMenuProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { run: runSignout, pending: isSigningOut } = usePendingAction(
    async () => {
      setAnchorEl(null);

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
      }
    }
  );

  return (
    <Box sx={{ ml: 2.5 }}>
      <Tooltip title="メニューを開く">
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
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
        onClose={() => {
          setAnchorEl(null);
        }}
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
          onClick={() => {
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ユーザー情報・設定変更</ListItemText>
        </MenuItem>
        {user.role === 'ADMINISTRATOR' && (
          <MenuItem
            component={NextLink}
            href={isAdminPage ? '/' : '/admin'}
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {isAdminPage ? (
                <HomeIcon fontSize="small" />
              ) : (
                <AdminPanelSettingsIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {isAdminPage ? '通常ページへ' : '管理者ページへ'}
            </ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            void runSignout();
          }}
          disabled={isSigningOut}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>サインアウト</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

type NavBarProps = {
  homeHref?: string;
  searchSlot?: ReactNode;
  withDrawerZIndex?: boolean;
};

const NavBar = ({
  homeHref = '/',
  searchSlot,
  withDrawerZIndex = false,
}: NavBarProps) => {
  const user = useOptionalCurrentUser();

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={
          withDrawerZIndex
            ? { zIndex: (theme) => theme.zIndex.drawer + 1 }
            : undefined
        }
      >
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
              href={homeHref}
              color="inherit"
              sx={{ textDecoration: 'none', pl: '10px' }}
            >
              Seichi Portal
            </Link>
          </Typography>
          {searchSlot}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: searchSlot ? 3 : 0,
            }}
          >
            <ThemeModeToggle />
            {!user ? (
              <SigninButton />
            ) : (
              <UserMenu user={user} isAdminPage={homeHref === '/admin'} />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
