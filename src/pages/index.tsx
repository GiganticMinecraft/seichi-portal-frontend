import { ContentLayout } from '@/components/Layout';
import { HomeIndex } from '@/features/home/components/Index';

const Index = () => (
  <ContentLayout
    title="Home"
    description="ギガンティック☆整地鯖の公式ポータルサイトです。"
  >
    <HomeIndex />
  </ContentLayout>
);

export default Index;
