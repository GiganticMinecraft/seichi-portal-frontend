import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
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
    sdk.getMinecraftPunishments({
      client: serverApiClient,
      headers: authorizationHeader(session.token),
      path: { uuid: session.user.id },
    })
  );

  return <PunishmentHistoryView punishments={punishments} />;
};

export default Home;
