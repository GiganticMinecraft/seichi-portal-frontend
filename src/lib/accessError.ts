export class AccessError extends Error {
  status: number;
  code: 'FORBIDDEN' | 'SERVICE_UNAVAILABLE';

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status: number;
    code: 'FORBIDDEN' | 'SERVICE_UNAVAILABLE';
  }) {
    super(message);
    this.name = 'AccessError';
    this.status = status;
    this.code = code;
  }
}

export const isAccessError = (error: unknown): error is AccessError =>
  error instanceof AccessError;
