import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Fallback } from '@/components/Fallback';
import { ContentLayout } from '@/components/Layout';
import { FormInfoList } from '@/features/forms/components/FormInfoList';

const ShowFormInfoList = () => (
  <ContentLayout
    title="フォーム一覧"
    description="回答できるフォームの一覧を表示します。"
  >
    <ErrorBoundary>
      <Suspense fallback={<Fallback />}>
        <FormInfoList />
      </Suspense>
    </ErrorBoundary>
  </ContentLayout>
);

export default ShowFormInfoList;
