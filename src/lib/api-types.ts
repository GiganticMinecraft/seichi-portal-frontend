import { z } from 'zod';
import { schemas } from '@/generated/api-client';

export const errorResponseSchema = z.object({
  errorCode: z.string(),
  reason: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
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
export type GetUsersResponse = z.infer<typeof schemas.User>;
export type GetUserListResponse = z.infer<typeof schemas.User>[];
export type SearchResponse = z.infer<typeof schemas.CrossSearchResult>;
export type GetNotificationSettingsResponse = z.infer<
  typeof schemas.NotificationSettingsResponse
>;
export type CreateFormSchema = z.infer<typeof schemas.FormCreateSchema>;
export type UpdateNotificationSettingsSchema = z.infer<
  typeof schemas.NotificationSettingsUpdateSchema
>;
