import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import DataTable from './_components/Dashboard';

export const metadata: Metadata = {
  title: '管理ダッシュボード | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const [answers, forms] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/answers', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
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
