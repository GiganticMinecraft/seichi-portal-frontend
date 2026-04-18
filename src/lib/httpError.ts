export class HttpError extends Error {
  status: number;
  url: string;

  constructor({
    message,
    status,
    url,
  }: {
    message: string;
    status: number;
    url: string;
  }) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError;
