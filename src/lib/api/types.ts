import type { components, paths } from '@/generated/api-types';

export type ApiPaths = paths;
export type ApiComponents = components;

export type AnswerCommentType = components['schemas']['AnswerComment'] & {
  comment_id: string;
};

export type GetQuestionsResponse =
  components['schemas']['QuestionResponseSchema'][];
export type GetFormsResponse =
  paths['/forms']['get']['responses'][200]['content']['application/json'];
export type GetFormResponse =
  paths['/forms/{id}']['get']['responses'][200]['content']['application/json'];
export type CreateFormResponse =
  paths['/forms']['post']['responses'][201]['content']['application/json'];
export type GetFormAnswersResponse =
  paths['/forms/{id}/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswersResponse =
  paths['/forms/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswerResponse =
  paths['/forms/{form_id}/answers/{answer_id}']['get']['responses'][200]['content']['application/json'];
export type GetFormLabelsResponse =
  paths['/labels/forms']['get']['responses'][200]['content']['application/json'];
export type GetAnswerLabelsResponse =
  paths['/labels/answers']['get']['responses'][200]['content']['application/json'];
export type GetMessagesResponse =
  paths['/forms/{form_id}/answers/{answer_id}/messages']['get']['responses'][200]['content']['application/json'];
export type GetUsersResponse =
  paths['/users/me']['get']['responses'][200]['content']['application/json'];
export type GetUserListResponse =
  paths['/users']['get']['responses'][200]['content']['application/json'];
export type SearchResponse =
  paths['/search']['get']['responses'][200]['content']['application/json'];
export type GetNotificationSettingsResponse =
  paths['/notifications/settings/me']['get']['responses'][200]['content']['application/json'];
export type CreateFormSchema =
  paths['/forms']['post']['requestBody']['content']['application/json'];
export type UpdateNotificationSettingsSchema =
  paths['/notifications/settings/me']['patch']['requestBody']['content']['application/json'];
