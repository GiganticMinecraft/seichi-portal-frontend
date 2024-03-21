import styles from '@/app/page.module.css';
import NavBar from '@/components/NavBar';

const Home = () => {
  return (
    <main className={styles['main']}>
      <NavBar />
      <p>不正なリクエストです</p>
    </main>
  );
};

export default Home;
