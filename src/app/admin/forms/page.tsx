import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getForms } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';
import styles from '../../page.module.css';
import { CreateFormButton, Forms } from '@/features/form/components/DashboardFormList';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const forms = await getForms(token);
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <CreateFormButton />
      <Forms forms={forms} />
    </main>
  );
};

export default Home;
