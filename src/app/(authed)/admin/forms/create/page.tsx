'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import FormCreateForm from './_components/FormCreateForm';
import adminDashboardTheme from '../../theme/adminDashboardTheme';

const Home = () => {
  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormCreateForm />
    </ThemeProvider>
  );
};

export default Home;
