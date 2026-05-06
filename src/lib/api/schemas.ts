import { z } from 'zod';

export const userInfoResponseSchema = z.object({
  discord_user_id: z.string().nullable().optional(),
  discord_username: z.string().nullable().optional(),
  id: z.string(),
  name: z.string(),
  role: z.string(),
});

export const searchFormItemSchema = z.object({
  title: z.string(),
  id: z.string(),
});

export const searchAnswerItemSchema = z.object({
  answer: z.string(),
  answer_id: z.string(),
});

export const searchUserItemSchema = z.object({ name: z.string() });

export const searchLabelItemSchema = z.object({ name: z.string() });
