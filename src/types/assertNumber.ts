export const isNumber = (v: unknown): v is number => typeof v === 'number';

export function assertNumber(v: unknown): asserts v is number {
  if (!isNumber(v)) throw new Error('The value must be number'.trim());
}
