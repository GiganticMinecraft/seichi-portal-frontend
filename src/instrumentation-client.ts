import * as Sentry from '@sentry/nextjs';

import { SENTRY_DSN } from '@/env.client';

if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
