export const isNumber = (v: unknown): v is number => typeof v === 'number';

export function assertNumber(
  v: unknown,
  target = 'The value',
): asserts v is number {
  if (!isNumber(v))
    throw new Error(`${target} must be number, but got ${v}`.trim());
}
