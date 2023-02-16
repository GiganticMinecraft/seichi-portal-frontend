import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

export const requireAccessToken = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
  scopes: string[],
) => {
  const request = {
    scopes,
    account,
  };

  const authResult = await instance
    .acquireTokenSilent(request)
    .catch(() => instance.acquireTokenPopup(request));

  return authResult.accessToken;
};
