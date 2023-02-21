import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

export const requireMsAccountAccessToken = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
  scopes: string[],
) => {
  const request = {
    scopes,
    account,
  };
  const result = await instance
    .acquireTokenSilent(request)
    .catch(() => instance.acquireTokenPopup(request));

  return result.accessToken;
};
