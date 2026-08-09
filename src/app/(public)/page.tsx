import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getSeichiProxyHeaders, getTurnstileSiteKey } from '@/env.server';
import type { GetFormsResponse } from '@/lib/api-types';
import { serverApiClient } from '@/lib/server/backend';
import { getSession } from '@/lib/server/session';

import { LandingContent } from './_components/LandingContent';

const fetchPublicForms = async (
  requestHeaders: Pick<Headers, 'get'>
): Promise<GetFormsResponse> => {
  try {
    const { data, error } = await serverApiClient.GET('/api/v1/forms', {
      headers: getSeichiProxyHeaders(requestHeaders),
    });
    if (error) {
      console.error('Failed to fetch public forms:', error);
      return [];
    }
    return data.items.filter((f) => f.settings.allow_temporary_answers);
  } catch (err) {
    console.error('Network error while fetching public forms:', err);
    return [];
  }
};

const LandingPage = async () => {
  const session = await getSession();
  if (session.state === 'authenticated') {
    redirect('/home');
  }

  const publicForms = await fetchPublicForms(await headers());

  return (
    <LandingContent
      publicForms={publicForms}
      turnstileSiteKey={getTurnstileSiteKey()}
    />
  );
};

export default LandingPage;
