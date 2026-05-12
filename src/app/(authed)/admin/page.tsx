import DataTable from './_components/Dashboard';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetAnswersResponse, GetFormsResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理ダッシュボード | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const [answers, forms] = await Promise.all([
    backendFetchJson<GetAnswersResponse>('/forms/answers', {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<GetFormsResponse>('/forms', {
      method: 'GET',
      token: session.token,
    }),
  ]);

  return (
    <DataTable
      answerResponseWithFormTitle={answers.map((answer) => {
        return {
          ...answer,
          form_title:
            forms.find((form) => form.id === answer.form_id)?.title ??
            'unknown form',
        };
      })}
    />
  );
};

export default Home;
