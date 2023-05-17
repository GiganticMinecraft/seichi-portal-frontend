import * as Sentry from '@sentry/nextjs';

import { isProduction } from '@/libs';

if (isProduction) {
  Sentry.init({
    dsn: 'https://4515414ac1284a4b93616b3e47e59772@sentry.onp.admin.seichi.click/4',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.25,

    initialScope: (scope) => {
      scope.setLevel('warning');

      return scope;
    },
    ignoreErrors: ['popup_window_error'],

    // ...

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });

  Sentry.configureScope((scope) => scope.setLevel('warning'));
}
