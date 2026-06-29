'use client';

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { SWRConfig } from 'swr';
import { MsalProvider } from '@/app/_components/MsalProvider';
import { fetcher } from '@/app/_swr/fetcher';
import { getAuthedTheme, type ThemeMode } from './getAuthedTheme';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'seichi-portal-theme-mode';
const THEME_MODE_EVENT = 'seichi-portal-theme-mode-change';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const subscribeThemeMode = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleThemeModeChange = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(THEME_MODE_EVENT, handleThemeModeChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(THEME_MODE_EVENT, handleThemeModeChange);
  };
};

const getThemeModeSnapshot = (): ThemeMode =>
  window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';

const getThemeModeServerSnapshot = (): ThemeMode => 'light';

export const AppProviders = ({
  children,
  msalClientId,
  msalRedirectUri,
}: {
  children: ReactNode;
  msalClientId: string;
  msalRedirectUri: string;
}) => {
  const mode = useSyncExternalStore(
    subscribeThemeMode,
    getThemeModeSnapshot,
    getThemeModeServerSnapshot
  );

  const setMode = (nextMode: ThemeMode) => {
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    window.dispatchEvent(new Event(THEME_MODE_EVENT));
  };

  const theme = useMemo(() => getAuthedTheme(mode), [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode(mode === 'light' ? 'dark' : 'light'),
    }),
    [mode]
  );

  return (
    <AppRouterCacheProvider>
      <ThemeModeContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SWRConfig
            value={{
              fetcher,
            }}
          >
            <MsalProvider clientId={msalClientId} redirectUri={msalRedirectUri}>
              {children}
            </MsalProvider>
          </SWRConfig>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </AppRouterCacheProvider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within AppProviders');
  }

  return context;
};

export const useOptionalThemeMode = () => useContext(ThemeModeContext);
