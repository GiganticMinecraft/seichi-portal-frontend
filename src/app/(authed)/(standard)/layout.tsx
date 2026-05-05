'use client';

import '../../globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SWRConfig } from 'swr';
import NavBar from '@/app/_components/NavBar';
import { fetcher } from '@/app/_swr/fetcher';
import type { ReactNode } from 'react';

const theme = createTheme();

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <title>Seichi Portal</title>
        <meta name="description" content="整地鯖公式のポータルサイトです。" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
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
              <SWRConfig
                value={{
                  fetcher: fetcher,
                }}
              >
                <NavBar />
                {children}
              </SWRConfig>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
