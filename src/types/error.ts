/* eslint-disable max-classes-per-file */

import { ZodError } from 'zod';

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

export class ValidationError extends BaseError {
  readonly zodError: ZodError;

  constructor(zodError: ZodError) {
    super('予期しない型を受け取りました');
    this.zodError = zodError;
  }
}
