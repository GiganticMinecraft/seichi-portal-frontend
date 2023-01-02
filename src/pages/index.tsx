import { HomeIndex } from '@/features/home/components/Index';
import { ContentLayout } from '@/shared/Layout';

const Index = () => (
  <ContentLayout
    title="Home"
    description="ギガンティック☆整地鯖の公式ポータルサイトです。"
  >
    <HomeIndex />
  </ContentLayout>
);

export default Index;
