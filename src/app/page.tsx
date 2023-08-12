import ButtonAppBar from '@/components/buttonAppBar';
import styles from './page.module.css';
import Menu from '@/components/menu';

export default function Home() {
  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <Menu />
    </main>
  );
}
