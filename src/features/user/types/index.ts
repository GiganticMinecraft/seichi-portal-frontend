import { z } from 'zod';

/**
 * XBoxLiveサービスにアクセスしたときに返ってくるResponseのスキーマ
 */
export const requireXboxTokenResponse = z.object({
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z.array(z.object({ uhs: z.string() })),
  }),
});

/**
 * XBoxLiveサービスにアクセスするためのトークンとユーザーハッシュ値
 */
export type XboxToken = {
  token: string;
  userHash: string;
};

/**
 * Minecraftアカウントにアクセスするためのトークン
 */
export type McAccessToken = {
  token: string;
};

/**
 * MCIDとUUID
 */
export type McProfile = {
  id: string;
  name: string;
};
