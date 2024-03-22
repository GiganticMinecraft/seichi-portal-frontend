'use client';

import DashboardMenu from '@/components/DashboardMenu';
import { CreateFormComponent } from '@/features/form/components/CreateForm';
const Home = () => {
  return (
    <>
      <DashboardMenu />
      <CreateFormComponent />
    </>
  );
};

export default Home;
