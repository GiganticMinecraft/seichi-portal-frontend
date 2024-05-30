import { CssBaseline, ThemeProvider } from '@mui/material';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import AnswerDetails from './_components/AnswerDetails';

const Home = ({ params }: { params: { answerId: number } }) => {
  // const fetcher = (url: string) => fetch(url).then((res) => res.json());

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <AnswerDetails />
    </ThemeProvider>
  );
};

export default Home;
