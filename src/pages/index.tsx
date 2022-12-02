import { ContentLayout } from '@/components/Layout';
import { HomeIndex } from '@/features/home/components/Index';

const Index = () => (
  <ContentLayout title="Home" description="Seichi Server Portal Site">
    <HomeIndex />
  </ContentLayout>
);

export default Index;
