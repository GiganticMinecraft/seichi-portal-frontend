import FormsPageContent from './_components/FormsPageContent';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム管理 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const [forms, labels] = await Promise.all([
    backendFetchJson<GetFormsResponse>('/forms', {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<GetFormLabelsResponse>('/labels/forms', {
      method: 'GET',
      token: session.token,
    }),
  ]);

  return <FormsPageContent forms={forms} labels={labels} />;
};

export default Home;
