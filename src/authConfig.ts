import { Configuration } from '@azure/msal-browser';

import { MS_APP_CLIENT_ID, MS_APP_REDIRECT_URL } from '@/env';

export const msalConfig: Configuration = {
  auth: {
    clientId: MS_APP_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: MS_APP_REDIRECT_URL,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};
