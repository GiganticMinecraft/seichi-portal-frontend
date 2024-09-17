'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import adminDashboardTheme from '../theme/adminDashboardTheme';

const Home = () => {
  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default Home;
