import { z } from 'zod';

export const msAuthJson = z.object({
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z.array(z.object({ uhs: z.string() })),
  }),
});

export type MsAuthResult = {
  token: string;
  userHash: string;
};
