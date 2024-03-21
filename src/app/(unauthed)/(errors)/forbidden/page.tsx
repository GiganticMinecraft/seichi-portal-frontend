import NavBar from '@/components/NavBar';
import styles from '../page.module.css';

const Home = () => {
  return (
    <main className={styles['main']}>
      <NavBar />
      <p>このページを表示する権限がありません。</p>
    </main>
  );
};

export default Home;
