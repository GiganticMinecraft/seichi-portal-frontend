import { z } from 'zod';

/**
 * バックエンドサーバーからのレスポンススキーマの定義。
 */

// GET /forms
export const createFormResponseSchema = z.object({
  id: z.number(),
});

export type CreateFormResponse = z.infer<typeof createFormResponseSchema>;
