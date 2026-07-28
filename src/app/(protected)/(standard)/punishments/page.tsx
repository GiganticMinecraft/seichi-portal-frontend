import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

import PunishmentHistoryView from './_components/PunishmentHistoryView';

export const metadata: Metadata = {
  title: '処罰履歴 | Seichi Portal',
};

const Home = async () => {
  const session = await requireUser();
  const punishments = await requireBackendData(
    serverApiClient.GET('/api/v1/users/{uuid}/minecraft-punishments', {
      headers: authorizationHeader(session.token),
      params: {
        path: { uuid: session.user.id },
      },
    })
  );

  return <PunishmentHistoryView punishments={punishments} />;
};

export default Home;
