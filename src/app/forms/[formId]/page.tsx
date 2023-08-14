import ButtonAppBar from '@/components/buttonAppBar';
import styles from '../../page.module.css';
import { getForm } from '@/api/form';
import Questions from '@/components/form';

export default async function Home({ params }: { params: { formId: number } }) {
  const form = await getForm(params.formId);

  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <Questions form={form} />
    </main>
  );
}
