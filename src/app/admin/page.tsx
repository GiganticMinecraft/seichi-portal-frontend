import DataTable from '@/components/Dashboard';
import DashboardMenu from '@/components/DashboardMenu';
import { getAllAnswers } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async () => {
  const token = getCachedToken() ?? '';
  const answers = await getAllAnswers(token);
  return (
    <>
      <DashboardMenu />
      <DataTable answers={answers} />
    </>
  );
};

export default Home;
