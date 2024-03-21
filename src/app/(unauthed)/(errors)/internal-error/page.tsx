import NavBar from '@/components/NavBar';
import styles from '../page.module.css';

const Home = () => {
  return (
    <main className={styles['main']}>
      <NavBar />
      <p>内部エラーが発生しました</p>
    </main>
  );
};

export default Home;
