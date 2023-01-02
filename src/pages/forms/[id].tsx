import { Suspense } from 'react';

import { EachForm } from '@/features/forms/components/EachForm';
import { ErrorBoundary } from '@/shared/ErrorBoundary';
import { Fallback } from '@/shared/Fallback';
import { ContentLayout } from '@/shared/Layout';

const ShowEachForm = () => (
  <ContentLayout
    title="フォームに回答"
    description="各フォームにご回答いただけます。"
  >
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
