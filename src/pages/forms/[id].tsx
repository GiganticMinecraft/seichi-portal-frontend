import { useRouter } from 'next/router';
import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Fallback } from '@/components/Fallback';
import { ContentLayout } from '@/components/Layout';
import { EachForm } from '@/features/forms/components/EachForm';

const ShowEachForm = () => {
  const { id } = useRouter<'/forms/[id]'>().query;

  return (
    <ContentLayout title="フォームに回答">
      <ErrorBoundary>
        <Suspense fallback={<Fallback />}>
          <EachForm formId={id} />
        </Suspense>
      </ErrorBoundary>
    </ContentLayout>
  );
};

export default ShowEachForm;
