import { isRight } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import { redirectOrDoNothing } from '@/app/error/RedirectByErrorResponse';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getForms } from '@/features/form/api/form';
import {
  CreateFormButton,
  Forms,
} from '@/features/form/components/DashboardFormList';
import { getCachedToken } from '@/features/user/api/mcToken';
import { getUser } from '@/features/user/api/user';
import styles from '../../page.module.css';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const forms = await getForms(token);
  const user = await getUser(token);

  if (isRight(user) && user.right.role == 'STANDARD_USER') {
    redirect('/forbidden');
  }

  if (isRight(forms)) {
    return (
      <main className={styles['main']}>
        <NavBar />
        <DashboardMenu />
        <CreateFormButton />
        <Forms forms={forms.right} />
      </main>
    );
  } else {
    redirectOrDoNothing(forms);
    return <></>;
  }
};

export default Home;
