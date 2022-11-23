import { ChakraLink } from '@/components/ChakraLink';
import { ContentLayout } from '@/components/Layout';
import { NextLink } from '@/components/NextLink';

const Index = () => (
  <ContentLayout title="Home" description="Seichi Server Portal Site">
    <NextLink href="/forms">
      <ChakraLink>フォーム一覧</ChakraLink>
    </NextLink>
  </ContentLayout>
);

export default Index;
