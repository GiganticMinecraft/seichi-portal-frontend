import { getForms } from '@/api/form';
import ButtonAppBar from '../components/buttonAppBar';
import Forms from '../components/forms';
import styles from '../page.module.css';

export default async function Home() {
  const forms = await getForms();
  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <Forms forms={forms} />
    </main>
  );
}
