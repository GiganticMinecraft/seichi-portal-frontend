'use client';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, type ReactNode } from 'react';

import NavBar from '@/app/_components/NavBar';

import DashboardMenu from './DashboardMenu';

type AdminShellProps = {
  searchSlot: ReactNode;
  children: ReactNode;
};

const AdminShell = ({ searchSlot, children }: AdminShellProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <NavBar
        homeHref="/admin"
        searchSlot={searchSlot}
        withDrawerZIndex
        {...(isMobile && {
          onMenuButtonClick: () => {
            setMobileOpen((prev) => !prev);
          },
        })}
      />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
          pt: { xs: 'calc(56px + 1rem)', md: 'calc(64px + 2rem)' },
          pb: { xs: '1rem', md: '2rem' },
        }}
      >
        <DashboardMenu
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          {...(isMobile && {
            onClose: () => {
              setMobileOpen(false);
            },
          })}
        />
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            px: { xs: '1rem', md: '2rem' },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default AdminShell;
