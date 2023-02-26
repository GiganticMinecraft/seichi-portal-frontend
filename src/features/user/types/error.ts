/* eslint-disable max-classes-per-file */

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
