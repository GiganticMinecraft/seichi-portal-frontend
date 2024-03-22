import DashboardMenu from '@/components/DashboardMenu';
import { CreateFormComponent } from '@/features/form/components/CreateForm';
const Home = async () => {
  return (
    <>
      <DashboardMenu />
      <CreateFormComponent />
    </>
  );
};

export default Home;
