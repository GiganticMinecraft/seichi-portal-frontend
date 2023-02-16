import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

import { MsAccessToken } from '../types';

export const requireMsAccountAccessToken = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
  scopes: string[],
): Promise<MsAccessToken> => {
  const request = {
    scopes,
    account,
  };
  const result = await instance
    .acquireTokenSilent(request)
    .catch(() => instance.acquireTokenPopup(request));

  return { token: result.accessToken };
};
