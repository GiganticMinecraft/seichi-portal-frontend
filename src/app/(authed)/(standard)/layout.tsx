'use client';

import { Box } from '@mui/material';
import NavBar from '@/app/_components/NavBar';
import type { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pt: { xs: 'calc(56px + 1rem)', md: 'calc(64px + 2rem)' },
        px: { xs: '1rem', md: '2rem' },
        pb: { xs: '1rem', md: '2rem' },
      }}
    >
      <NavBar />
      {children}
    </Box>
  );
};

export default RootLayout;
