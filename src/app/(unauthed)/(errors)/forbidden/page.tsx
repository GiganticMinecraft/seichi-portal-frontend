import styles from '@/app/page.module.css';
import NavBar from '@/components/NavBar';

const Home = () => {
  return (
    <main className={styles['main']}>
      <NavBar />
      <p>このページを表示する権限がありません。</p>
    </main>
  );
};

export default Home;
