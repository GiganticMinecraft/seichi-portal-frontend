/* eslint-disable max-classes-per-file */

import { AuthError } from '@azure/msal-browser';

import { BaseError } from '@/types';

export class MsAccountOwnsNoMcAccount extends BaseError {
  constructor() {
    super('あなたのMicrosoftアカウントはMinecraftを購入していません');
  }
}

export class UserCancelledMsSignIn extends BaseError {
  constructor() {
    super('Microsoftアカウントへのサインインを取り消しました');
  }
}

export class UserDeniedAccess extends BaseError {
  constructor() {
    super(
      'あなたのMicrosoftアカウントにアクセスすることが拒否されました。許可してください',
    );
  }
}

export class MinecraftIdIsUndefined extends BaseError {
  constructor() {
    super('MinecraftIDが設定されていません。Minecraft側で設定してください');
  }
}

export class MicrosoftAuthenticationLibError extends BaseError {
  constructor(error: AuthError) {
    super('Microsoftとの認証中にエラーが発生しました', error);
  }
}
