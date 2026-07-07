'use client';

import { grey } from '@mui/material/colors';
import { alpha, createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const lightSurface = '#F4F7FB';
const darkSurface = '#081522';
const darkPrimaryMain = '#90CAF9';
const darkPrimaryHover = '#7EBFEF';
const darkPrimaryText = '#102235';

export const getAuthedTheme = () =>
  createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-mui-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#1976D2',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#0F5D8C',
            contrastText: '#FFFFFF',
          },
          background: {
            default: lightSurface,
            paper: '#FFFFFF',
          },
          text: {
            primary: '#13202B',
            secondary: 'rgba(19, 32, 43, 0.72)',
          },
          divider: 'rgba(19, 32, 43, 0.12)',
        },
      },
      dark: {
        palette: {
          primary: {
            main: darkPrimaryMain,
            dark: darkPrimaryHover,
            contrastText: darkPrimaryText,
          },
          secondary: {
            main: '#0F5D8C',
            contrastText: '#FFFFFF',
          },
          background: {
            default: darkSurface,
            paper: '#0B1825',
          },
          text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.72)',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
          grey: {
            ...grey,
            50: '#122131',
          },
        },
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: ({ theme }: { theme: Theme }) => ({
            backgroundColor: lightSurface,
            backgroundImage:
              'linear-gradient(180deg, rgba(15, 93, 140, 0.08) 0%, rgba(15, 93, 140, 0) 24%)',
            color: '#13202B',
            ...theme.applyStyles('dark', {
              backgroundColor: darkSurface,
              backgroundImage:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 28%)',
              color: '#FFFFFF',
            }),
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          formControl: ({ theme }) => ({
            position: 'static',
            transform: 'none',
            transition: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            marginBottom: '4px',
            color: theme.palette.text.primary,
            ...theme.applyStyles('dark', {
              color: '#FFFFFF',
            }),
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.common.white, 0.92),
            ...theme.applyStyles('dark', {
              backgroundColor: alpha(theme.palette.common.white, 0.12),
            }),
          }),
          input: {
            height: 'auto',
            paddingTop: '10px',
            paddingBottom: '8px',
          },
          notchedOutline: ({ theme }) => ({
            top: 0,
            borderColor: alpha(theme.palette.text.primary, 0.2),
            legend: {
              display: 'none',
            },
            ...theme.applyStyles('dark', {
              borderColor: 'rgba(255, 255, 255, 0.18)',
            }),
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 0,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'none',
            border: '1px solid rgba(19, 32, 43, 0.08)',
            boxShadow: '0px 6px 18px rgba(19, 32, 43, 0.08)',
            ...theme.applyStyles('dark', {
              backgroundColor: 'rgba(11, 24, 37, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow:
                '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
            }),
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            if (ownerState.color && ownerState.color !== 'default') {
              return {};
            }

            return {
              backgroundColor: alpha(theme.palette.primary.main, 0.14),
              color: theme.palette.primary.dark,
              fontWeight: 600,
              ...theme.applyStyles('dark', {
                backgroundColor: alpha(theme.palette.common.white, 0.16),
                color: '#FFFFFF',
              }),
            };
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.98),
            backgroundImage:
              'linear-gradient(180deg, rgba(15, 93, 140, 0.08) 0%, rgba(15, 93, 140, 0) 22%)',
            borderRight: `1px solid ${theme.palette.divider}`,
            ...theme.applyStyles('dark', {
              backgroundColor: '#102235',
              backgroundImage:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 22%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            }),
          }),
        },
      },
    },
  });
