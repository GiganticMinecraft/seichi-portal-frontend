import { z } from 'zod';
import { schemas } from '@/generated/api-client';

export const errorResponseSchema = z.object({
  detail: z.string(),
  errorCode: z.string(),
  status: z.number(),
  title: z.string(),
  type: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// AnswerComment の生成スキーマに comment_id が欠落しているため、拡張型を定義する
export type AnswerCommentType = z.infer<typeof schemas.AnswerComment> & {
  comment_id: string;
};

// CrossSearchResult の各フィールドは z.unknown() のため、実際の型を定義する
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
export type GetQuestionsResponse = z.infer<
  typeof schemas.QuestionResponseSchema
>[];

export type GetFormsResponse = z.infer<typeof schemas.FormSchema>[];
export type GetFormResponse = z.infer<typeof schemas.FormSchema>;
export type CreateFormResponse = z.infer<typeof schemas.FormSchema>;
export type GetFormAnswersResponse = z.infer<typeof schemas.FormAnswer>[];
export type GetAnswersResponse = z.infer<typeof schemas.FormAnswer>[];
export type GetAnswerResponse = z.infer<typeof schemas.FormAnswer>;
export type GetFormLabelsResponse = z.infer<
  typeof schemas.FormLabelResponseSchema
>[];
export type GetAnswerLabelsResponse = z.infer<typeof schemas.AnswerLabels>[];
export type GetMessagesResponse = z.infer<
  typeof schemas.MessageContentSchema
>[];
export type GetUsersResponse = z.infer<typeof schemas.UserInfoResponse>;
export type GetUserListResponse = z.infer<typeof schemas.UserSchema>[];
export type SearchResponse = z.infer<typeof schemas.CrossSearchResult>;
export type GetNotificationSettingsResponse = z.infer<
  typeof schemas.NotificationSettingsResponse
>;
export type CreateFormSchema = z.infer<typeof schemas.FormCreateSchema>;
export type UpdateNotificationSettingsSchema = z.infer<
  typeof schemas.NotificationSettingsUpdateSchema
>;
