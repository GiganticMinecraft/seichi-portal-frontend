import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { createOk, mapForResult } from 'option-t/lib/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/lib/PlainResult/tryCatchAsync';

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
    .then((res) => createOk(res))
    .catch(() =>
      tryCatchIntoResultWithEnsureErrorAsync(() =>
        instance.acquireTokenPopup(request),
      ),
    );

  return mapForResult(result, (r) => r.accessToken);
};
