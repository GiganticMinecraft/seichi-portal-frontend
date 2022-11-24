import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Fallback } from '@/components/Fallback';
import { ContentLayout } from '@/components/Layout';
import { FormsList } from '@/features/forms/components/FormsList';

const ShowFormsList = () => (
  <ContentLayout
    title="フォーム一覧"
    description="回答できるフォームの一覧を表示します。"
  >
    <ErrorBoundary>
      <Suspense fallback={<Fallback />}>
        <FormsList />
      </Suspense>
    </ErrorBoundary>
  </ContentLayout>
);

export default ShowFormsList;
