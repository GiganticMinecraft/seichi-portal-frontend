/* eslint-disable max-classes-per-file */

import { Result } from 'option-t/lib/PlainResult';
import { ZodError } from 'zod';

export type WrappedResult<T> = Result<T, BaseError>;

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
  readonly cause: ZodError;

  constructor(zodError: ZodError) {
    super('予期しない型を受け取りました');
    this.cause = zodError;
  }
}
