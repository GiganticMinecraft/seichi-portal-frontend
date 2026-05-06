'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#081522',
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 28%)',
          color: '#FFFFFF',
        },
      },
    },
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
          color: 'white',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop: '10px',
          paddingBottom: '8px',
          height: 'auto',
          background: 'rgba(255, 255, 255, 0.12)',
        },
        notchedOutline: {
          top: 0,
          borderColor: 'rgba(255, 255, 255, 0.18)',
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
          backgroundColor: 'rgba(11, 24, 37, 0.92)',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow:
            '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#001F38',
    },
    background: {
      default: '#081522',
      paper: '#0b1825',
    },
    text: {
      primary: '#FFFFFF',
    },
    divider: '#001F38',
  },
});

export default theme;
