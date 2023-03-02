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
    super('Microsoftアカウントへのサインインが取り消されました');
  }
}

export class UserDeniedAccess extends BaseError {
  constructor() {
    super(
      '本サービスがあなたのMicrosoftアカウントにアクセスすることが拒否されました',
    );
  }
}

export class MinecraftIdIsUndefined extends BaseError {
  constructor() {
    super('MinecraftIDが設定されていません');
  }
}

export class MicrosoftAuthenticationLibError extends BaseError {
  readonly cause: AuthError;

  constructor(error: AuthError) {
    super('Microsoftとの認証中にエラーが発生しました');
    this.cause = error;
  }
}
