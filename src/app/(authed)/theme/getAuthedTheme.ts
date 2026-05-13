'use client';

import { grey } from '@mui/material/colors';
import { alpha, createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const lightSurface = '#F4F7FB';
const darkSurface = '#081522';
const darkPrimaryMain = '#90CAF9';
const darkPrimaryHover = '#7EBFEF';
const darkPrimaryText = '#102235';

export const getAuthedTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? darkPrimaryMain : '#1976D2',
        dark: mode === 'dark' ? darkPrimaryHover : undefined,
        contrastText: mode === 'dark' ? darkPrimaryText : '#FFFFFF',
      },
      secondary: {
        main: '#0F5D8C',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'dark' ? darkSurface : lightSurface,
        paper: mode === 'dark' ? '#0B1825' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#13202B',
        secondary:
          mode === 'dark'
            ? 'rgba(255, 255, 255, 0.72)'
            : 'rgba(19, 32, 43, 0.72)',
      },
      divider:
        mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(19, 32, 43, 0.12)',
      grey: {
        ...grey,
        ...(mode === 'dark'
          ? {
              50: '#122131',
            }
          : {}),
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? darkSurface : lightSurface,
            backgroundImage:
              mode === 'dark'
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 28%)'
                : 'linear-gradient(180deg, rgba(15, 93, 140, 0.08) 0%, rgba(15, 93, 140, 0) 24%)',
            color: mode === 'dark' ? '#FFFFFF' : '#13202B',
          },
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
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.white, 0.92),
          }),
          input: {
            height: 'auto',
            paddingTop: '10px',
            paddingBottom: '8px',
          },
          notchedOutline: ({ theme }) => ({
            top: 0,
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.18)'
                : alpha(theme.palette.text.primary, 0.2),
            legend: {
              display: 'none',
            },
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
          root: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor:
              mode === 'dark' ? 'rgba(11, 24, 37, 0.92)' : '#FFFFFF',
            backgroundImage: 'none',
            border: `1px solid ${
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(19, 32, 43, 0.08)'
            }`,
            boxShadow:
              mode === 'dark'
                ? '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)'
                : '0px 6px 18px rgba(19, 32, 43, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            if (ownerState.color && ownerState.color !== 'default') {
              return {};
            }

            return {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.16)
                  : alpha(theme.palette.primary.main, 0.14),
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.primary.dark,
              fontWeight: 600,
            };
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? '#102235'
                : alpha(theme.palette.background.paper, 0.98),
            backgroundImage:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 22%)'
                : 'linear-gradient(180deg, rgba(15, 93, 140, 0.08) 0%, rgba(15, 93, 140, 0) 22%)',
            borderRight: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
