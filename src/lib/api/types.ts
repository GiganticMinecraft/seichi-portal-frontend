import type * as Api from '@/generated/api/types.gen';

export type AnswerComment = Api.AnswerComment;
export type CommentAttachmentResponse = Api.CommentAttachmentResponse;
export type AnswerPublication = Api.AnswerPublication;
export type AnswerStatus = Api.AnswerStatus;
export type CommentHistoryResponseEntry = Api.CommentHistoryResponseEntry;
export type MessageHistoryResponseEntry = Api.MessageHistoryResponseEntry;
export type AnswerStatusHistoryResponseEntry =
  Api.AnswerStatusHistoryResponseEntry;
export type AnswerTitleHistoryResponseEntry =
  Api.AnswerTitleHistoryResponseEntry;

export type GetQuestionsResponse = Api.QuestionResponseSchema[];
export type GetFormsPageResponse = Api.FormListHandlerResponses[200];
export type GetFormsResponse = GetFormsPageResponse['items'];
export type GetFormResponse = Api.GetFormHandlerResponses[200];
export type CreateFormResponse = Api.CreateFormHandlerResponses[201];
export type GetFormAnswersPageResponse =
  Api.GetAnswerByFormIdHandlerResponses[200];
export type GetFormAnswersResponse = GetFormAnswersPageResponse['items'];
export type GetAnswersPageResponse = Api.GetAllAnswersResponses[200];
export type GetAnswersResponse = GetAnswersPageResponse['items'];
export type GetAnswerResponse = Api.GetAnswerHandlerResponses[200];
export type GetFormLabelsResponse = Api.GetLabelsForFormsResponses[200];
export type GetAnswerLabelsResponse = Api.GetLabelsForAnswersResponses[200];
export type GetMessagesResponse = Api.GetMessagesHandlerResponses[200];
export type GetRelatedAnswersResponse =
  Api.GetRelatedAnswersHandlerResponses[200];
export type RelatedAnswerResponse = GetRelatedAnswersResponse[number];
export type GetCommentHistoryResponse = Api.GetCommentHistoryResponses[200];
export type GetMessageHistoryResponse = Api.GetMessageHistoryResponses[200];
export type GetAnswerStatusHistoryResponse =
  Api.GetAnswerStatusHistoryHandlerResponses[200];
export type GetAnswerTitleHistoryResponse =
  Api.GetAnswerTitleHistoryHandlerResponses[200];
export type GetUsersResponse = Api.GetMyUserInfoResponses[200];
export type GetUserResponse = Api.GetUserInfoResponses[200];
export type GetUserListPageResponse = Api.UserListResponses[200];
export type GetUserListResponse = GetUserListPageResponse['items'];
export type GetFormSubmissionRestrictionResponse =
  Api.GetFormSubmissionRestrictionResponses[200];
export type PutFormSubmissionRestrictionSchema = NonNullable<
  Api.PutFormSubmissionRestrictionData['body']
>;
export type GetFormSubmissionRestrictionHistoryResponse =
  Api.GetFormSubmissionRestrictionHistoryResponses[200];
export type GetMinecraftPunishmentsResponse =
  Api.GetMinecraftPunishmentsResponses[200];
export type SearchResponse = Api.CrossSearchResponses[200];
export type GetUserSearchPageResponse = Api.SearchUsersResponses[200];
export type GetUserSearchResponse = GetUserSearchPageResponse['users'];
export type AnswerSearchResponse = Api.SearchAnswersResponses[200];
export type GetNotificationsPageResponse = Api.GetNotificationsResponses[200];
export type GetNotificationsResponse = GetNotificationsPageResponse['items'];
export type NotificationResponse = GetNotificationsResponse[number];
export type GetNotificationSettingsResponse =
  Api.GetMyNotificationSettingsResponses[200];
export type CreateFormSchema = NonNullable<Api.CreateFormHandlerData['body']>;
export type UpdateNotificationSettingsSchema = NonNullable<
  Api.UpdateNotificationSettingsData['body']
>;
export type GetArchivedFormsPageResponse =
  Api.ArchivedFormListHandlerResponses[200];
export type GetArchivedFormsResponse = GetArchivedFormsPageResponse['items'];
export type UserGroupSchema = Api.UserGroupSchema;
export type GetUserGroupsResponse = Api.UserGroupListResponses[200];
export type CreateUserGroupSchema = NonNullable<
  Api.CreateUserGroupData['body']
>;
export type GetUserGroupMembersResponse = Api.UserGroupUserListResponses[200];
export type GetGlobalDiscordWebhookResponse =
  Api.GetGlobalDiscordWebhookResponses[200];
export type UpdateGlobalDiscordWebhookSchema = NonNullable<
  Api.UpdateGlobalDiscordWebhookData['body']
>;
