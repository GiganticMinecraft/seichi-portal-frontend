import { z } from 'zod';

export const xboxLiveServiceTokenResponseSchema = z.object({
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z.array(z.object({ uhs: z.string() })).nonempty(),
  }),
});
