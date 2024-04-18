'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        formControl: {
          // ラベルを上部に固定
          position: 'static',
          transform: 'none',
          transition: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem',
          color: 'white',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: 'black',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: '10px',
          paddingBottom: '8px',
          height: 'auto',
          background: '#FFFFFF29',
        },
        notchedOutline: {
          top: 0,
          legend: {
            display: 'none',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          color: 'white',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%), #121212',
          boxShadow:
            '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#90CAF9',
      contrastText: '#000000',
    },
    secondary: {
      main: '#001F38',
    },
    background: {
      default: '#010020',
    },
    text: {
      primary: '#FFFFFF',
    },
    divider: '#001F38',
  },
});

export default theme;
