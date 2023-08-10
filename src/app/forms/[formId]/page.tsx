import ButtonAppBar from '@/components/buttonAppBar';
import styles from '../../page.module.css';
import { getForm } from '@/api/form';

export default function Home({ params }: { params: { formId: number } }) {
  const form = getForm(params.formId);

  return (
    <main className={styles.main}>
      <ButtonAppBar />
      <p>{params.formId}</p>
    </main>
  );
}
