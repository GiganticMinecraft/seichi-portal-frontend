'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { CreateFormComponent } from './CreateForm2';
import adminDashboardTheme from '../../theme/adminDashboardTheme';

const Home = () => {
  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <CreateFormComponent />
    </ThemeProvider>
  );
};

export default Home;
