import AdminAnswerPageContent from './_components/AdminAnswerPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '回答管理 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ answerId: string }> }) => {
  const { answerId } = await params;

  return <AdminAnswerPageContent answerId={answerId} />;
};

export default Home;
