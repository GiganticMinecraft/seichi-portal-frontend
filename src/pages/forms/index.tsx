import { Suspense } from 'react';

import { FormInfoList } from '@/features/forms/components/FormInfoList';
import { ErrorBoundary } from '@/shared/ErrorBoundary';
import { Fallback } from '@/shared/Fallback';
import { ContentLayout } from '@/shared/Layout';

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
