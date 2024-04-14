'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
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
