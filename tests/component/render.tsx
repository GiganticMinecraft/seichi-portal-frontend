import { CssBaseline, ThemeProvider } from '@mui/material';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { getAuthedTheme } from '@/app/_providers/getAuthedTheme';

const ComponentTestProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={getAuthedTheme()}>
    <CssBaseline />
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  </ThemeProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: ComponentTestProviders, ...options });

export * from '@testing-library/react';
