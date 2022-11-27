import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Fallback } from '@/components/Fallback';
import { ContentLayout } from '@/components/Layout';
import { EachForm } from '@/features/forms/components/EachForm';

const ShowEachForm = () => (
  <ContentLayout title="フォームに回答">
    <ErrorBoundary
      statusMessages={{
        404: '指定されたIDのフォームは存在しないか、回答可能期間ではありません。',
      }}
    >
      <Suspense fallback={<Fallback />}>
        <EachForm />
      </Suspense>
    </ErrorBoundary>
  </ContentLayout>
);

export default ShowEachForm;
