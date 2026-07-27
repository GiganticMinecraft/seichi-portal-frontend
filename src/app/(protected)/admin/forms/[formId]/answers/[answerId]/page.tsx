import type { Metadata } from 'next';

import AnswerDetailsPageContent from '@/app/(protected)/_components/AnswerDetail/AnswerDetailsPageContent';

export const metadata: Metadata = {
  title: '回答詳細 | Seichi Portal',
};

const Home = async ({
  params,
}: {
  params: Promise<{ formId: string; answerId: string }>;
}) => {
  const { formId, answerId } = await params;

  return <AnswerDetailsPageContent formId={formId} answerId={answerId} />;
};

export default Home;
