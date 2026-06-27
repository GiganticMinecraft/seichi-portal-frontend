import type { components, paths } from '@/generated/api-types';

export type ApiPaths = paths;
export type ApiComponents = components;

export type AnswerCommentType = components['schemas']['AnswerComment'] & {
  comment_id: string;
};

export type GetQuestionsResponse =
  components['schemas']['QuestionResponseSchema'][];
export type GetFormsResponse =
  ApiPaths['/api/v1/forms']['get']['responses'][200]['content']['application/json'];
export type GetFormResponse =
  ApiPaths['/api/v1/forms/{id}']['get']['responses'][200]['content']['application/json'];
export type CreateFormResponse =
  ApiPaths['/api/v1/forms']['post']['responses'][201]['content']['application/json'];
export type GetFormAnswersResponse =
  ApiPaths['/api/v1/forms/{id}/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswersResponse =
  ApiPaths['/api/v1/forms/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswerResponse =
  ApiPaths['/api/v1/forms/{form_id}/answers/{answer_id}']['get']['responses'][200]['content']['application/json'];
export type GetFormLabelsResponse =
  ApiPaths['/api/v1/labels/forms']['get']['responses'][200]['content']['application/json'];
export type GetAnswerLabelsResponse =
  ApiPaths['/api/v1/labels/answers']['get']['responses'][200]['content']['application/json'];
export type GetMessagesResponse =
  ApiPaths['/api/v1/forms/{form_id}/answers/{answer_id}/messages']['get']['responses'][200]['content']['application/json'];
export type GetUsersResponse =
  ApiPaths['/api/v1/users/me']['get']['responses'][200]['content']['application/json'];
export type GetUserResponse =
  ApiPaths['/api/v1/users/{uuid}']['get']['responses'][200]['content']['application/json'];
export type GetUserListResponse =
  ApiPaths['/api/v1/users']['get']['responses'][200]['content']['application/json'];
export type GetAnswerSubmitterRestrictionResponse =
  ApiPaths['/api/v1/users/{uuid}/answer-submitter-restriction']['get']['responses'][200]['content']['application/json'];
export type PutAnswerSubmitterRestrictionSchema =
  ApiPaths['/api/v1/users/{uuid}/answer-submitter-restriction']['put']['requestBody']['content']['application/json'];
export type SearchResponse =
  ApiPaths['/api/v1/search']['get']['responses'][200]['content']['application/json'];
export type GetNotificationSettingsResponse =
  ApiPaths['/api/v1/notifications/settings/me']['get']['responses'][200]['content']['application/json'];
export type GetUserNotificationSettingsResponse =
  ApiPaths['/api/v1/notifications/settings/{uuid}']['get']['responses'][200]['content']['application/json'];
export type CreateFormSchema =
  ApiPaths['/api/v1/forms']['post']['requestBody']['content']['application/json'];
export type UpdateNotificationSettingsSchema =
  ApiPaths['/api/v1/notifications/settings/me']['patch']['requestBody']['content']['application/json'];
