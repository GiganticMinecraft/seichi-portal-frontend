import { getForms } from '@/api/form';
import styles from '@/app/page.module.css';
import ButtonAppBar from '@/components/buttonAppBar';
import Forms from '@/components/forms';

export default async function Home() {
  const forms = await getForms();
  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <Forms forms={forms} />
    </main>
  );
}
