import * as Sentry from '@sentry/nextjs';

import { getSentryDsn } from '@/env.server';

export const register = () => {
  const dsn = getSentryDsn();
  if (dsn === undefined) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
  });
};

export const onRequestError = Sentry.captureRequestError;
