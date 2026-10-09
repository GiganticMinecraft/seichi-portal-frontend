import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

import MyAnswersPageContent from './_components/MyAnswersPageContent';

export const metadata: Metadata = {
  title: '自分の回答一覧 | Seichi Portal',
};

const Page = async () => {
  const session = await requireUser();
  const initialAnswers = await requireBackendData(
    sdk.getAllAnswers({
      client: serverApiClient,
      headers: authorizationHeader(session.token),
      query: { user: session.user.id },
    })
  );

  return (
    <MyAnswersPageContent
      initialAnswers={initialAnswers}
      currentUserId={session.user.id}
    />
  );
};

export default Page;
