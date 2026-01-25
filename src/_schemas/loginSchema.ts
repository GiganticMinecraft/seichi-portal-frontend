import { z } from 'zod';

export const xboxLiveServiceTokenResponseSchema = z.object({
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z
      .tuple([z.object({ uhs: z.string() })])
      .rest(z.object({ uhs: z.string() })),
  }),
});

export const minecraftAccessTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().int(),
});
