export const isString = (v: unknown): v is string => typeof v === 'string';

export function assertString(v: unknown, target = ''): asserts v is string {
  if (!isString(v)) throw new Error(`${target} must be string`.trim());
}
