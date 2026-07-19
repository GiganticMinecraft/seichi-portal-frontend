import type { Metadata } from 'next';
import { Suspense } from 'react';

import SearchPageContent from './_components/SearchPageContent';

export const metadata: Metadata = {
  title: '検索結果 | Seichi Portal',
};

const Page = () => (
  <Suspense fallback={null}>
    <SearchPageContent />
  </Suspense>
);

export default Page;
