import { z } from 'zod';

export const xboxLiveServiceTokenResponseSchema = z.object({
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z.array(z.object({ uhs: z.string() })).nonempty(),
  }),
});

export const minecraftAccessTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().int(),
});

export const minecraftProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
