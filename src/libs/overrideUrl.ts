import { isProduction } from './misc';

export type Override = {
  original: string;
  override: string;
};

export type Overrides<T extends string> = { [key in T]: Override };

export const overrideUrl = <T extends string>(rewrites: Overrides<T>, key: T) =>
  isProduction ? rewrites[key].original : rewrites[key].override;
