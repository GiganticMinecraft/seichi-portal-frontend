import {
  AccountInfo,
  AuthError,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { createOk } from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';

import { matchForResult } from '@/libs';

import { MicrosoftAuthenticationLibError } from '../types';

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

  return matchForResult(
    result,
    (r) => r.accessToken,
    // NOTE: MSAL.jsがthrowする例外はすべてAuthErrorを継承しているので、型assertionしても問題ない
    (e) => new MicrosoftAuthenticationLibError(e as AuthError),
  );
};
