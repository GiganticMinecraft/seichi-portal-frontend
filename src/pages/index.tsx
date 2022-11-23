import Link from 'next/link';

import { ContentLayout } from '@/components/Layout';

const Index = () => (
  <ContentLayout title="Home" description="Seichi Server Portal Site">
    <Link href="/forms">フォーム一覧</Link>
  </ContentLayout>
);

export default Index;
