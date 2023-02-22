/* eslint-disable max-classes-per-file */

class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class HasNoMinecraft extends BaseError {
  constructor() {
    super('あなたのMicrosoftアカウントはMinecraftを購入していません');
  }
}

export class NetworkError extends BaseError {
  readonly statusCode: number;

  readonly statusText: string;

  constructor(statusCode: number, statusText: string) {
    super(`通信中にエラーが発生しました: ${statusCode} ${statusText}`);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}
