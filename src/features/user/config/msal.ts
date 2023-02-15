import { Configuration } from '@azure/msal-browser';

import { MS_APP_CLIENT_ID } from '@/const/env';

export const msalConfig: Configuration = {
  auth: {
    clientId: MS_APP_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};
