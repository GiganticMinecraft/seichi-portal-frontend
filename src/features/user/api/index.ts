import { IPublicClientApplication } from '@azure/msal-browser';

import { getMcProfile } from './getMcProfile';
import { hasMcAccount } from './hasMcAccount';
import { requireMcAccessToken } from './requireMcAccessToken';
import { requireMsAccountAccessToken } from './requireMsAccountAccessToken';
import { requireXblToken } from './requireXblToken';
import { requireXstsToken } from './requireXstsToken';

import { loginRequest } from '../config/msal';

const getMinecraftGameProfile = async ([instance, account, scopes]: Parameters<
  typeof requireMsAccountAccessToken
>) => {
  const msAccessToken = await requireMsAccountAccessToken(
    instance,
    account,
    scopes,
  );
  const xblToken = await requireXblToken(msAccessToken);
  const xstsToken = await requireXstsToken(xblToken);
  const mcAccessToken = await requireMcAccessToken(xstsToken);
  const hasMc = await hasMcAccount(mcAccessToken);
  // TODO: ここの条件分岐がfalseになる（MCアカウントをもっている）のに、getMcProfileが404になる場合がある
  // これは、アカウントをもっているにも関わらず、アカウント名を設定していないため
  if (!hasMc) {
    throw new Error("The Microsoft account doesn't own Minecraft.");
  }

  return getMcProfile(mcAccessToken);
};

export const loginAndGetGameProfile = async (
  instance: IPublicClientApplication,
) => {
  // TODO: catch and rethrow error
  const { account } = await instance.loginPopup(loginRequest);
  if (!account) {
    throw new Error('AccountInfo is null.');
  }

  return getMinecraftGameProfile([instance, account, loginRequest.scopes]);
};
