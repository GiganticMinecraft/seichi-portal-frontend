/* eslint-disable max-classes-per-file */

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
