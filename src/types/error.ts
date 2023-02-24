/* eslint-disable max-classes-per-file */
export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NetworkError extends BaseError {
  readonly httpStatusCode: number;

  readonly httpStatusText: string;

  constructor(statusCode: number, statusText: string) {
    super(`通信中にエラーが発生しました: ${statusCode} ${statusText}`);
    this.httpStatusCode = statusCode;
    this.httpStatusText = statusText;
  }
}
