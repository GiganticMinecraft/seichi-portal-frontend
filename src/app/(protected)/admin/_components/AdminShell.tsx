'use client';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, type ReactNode } from 'react';

import NavBar from '@/app/_components/NavBar';

import styles from '../../../page.module.css';

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
      <main className={styles['main']}>
        <DashboardMenu
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          {...(isMobile && {
            onClose: () => {
              setMobileOpen(false);
            },
          })}
        />
        {children}
      </main>
    </>
  );
};

export default AdminShell;
