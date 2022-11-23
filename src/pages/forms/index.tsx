import { ContentLayout } from '@/components/Layout';
import { FormsList } from '@/features/forms/components/FormsList';

const ShowFormsList = () => (
  <ContentLayout
    title="フォーム一覧"
    description="回答できるフォームの一覧を表示します。"
  >
    <FormsList />
  </ContentLayout>
);

export default ShowFormsList;
