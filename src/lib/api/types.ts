import type { components, paths } from '@/generated/api-types';

type StripApiV1Prefix<Path> = Path extends `/api/v1${infer Rest}`
  ? Rest extends ''
    ? '/'
    : Rest
  : Path;

export type ApiPaths = {
  [Path in keyof paths as StripApiV1Prefix<Path>]: paths[Path];
};
export type ApiComponents = components;

export type AnswerCommentType = components['schemas']['AnswerComment'] & {
  comment_id: string;
};

export type GetQuestionsResponse =
  components['schemas']['QuestionResponseSchema'][];
export type GetFormsResponse =
  ApiPaths['/forms']['get']['responses'][200]['content']['application/json'];
export type GetFormResponse =
  ApiPaths['/forms/{id}']['get']['responses'][200]['content']['application/json'];
export type CreateFormResponse =
  ApiPaths['/forms']['post']['responses'][201]['content']['application/json'];
export type GetFormAnswersResponse =
  ApiPaths['/forms/{id}/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswersResponse =
  ApiPaths['/forms/answers']['get']['responses'][200]['content']['application/json'];
export type GetAnswerResponse =
  ApiPaths['/forms/{form_id}/answers/{answer_id}']['get']['responses'][200]['content']['application/json'];
export type GetFormLabelsResponse =
  ApiPaths['/labels/forms']['get']['responses'][200]['content']['application/json'];
export type GetAnswerLabelsResponse =
  ApiPaths['/labels/answers']['get']['responses'][200]['content']['application/json'];
export type GetMessagesResponse =
  ApiPaths['/forms/{form_id}/answers/{answer_id}/messages']['get']['responses'][200]['content']['application/json'];
export type GetUsersResponse =
  ApiPaths['/users/me']['get']['responses'][200]['content']['application/json'];
export type GetUserResponse =
  ApiPaths['/users/{uuid}']['get']['responses'][200]['content']['application/json'];
export type GetUserListResponse =
  ApiPaths['/users']['get']['responses'][200]['content']['application/json'];
export type SearchResponse =
  ApiPaths['/search']['get']['responses'][200]['content']['application/json'];
export type GetNotificationSettingsResponse =
  ApiPaths['/notifications/settings/me']['get']['responses'][200]['content']['application/json'];
export type GetUserNotificationSettingsResponse =
  ApiPaths['/notifications/settings/{uuid}']['get']['responses'][200]['content']['application/json'];
export type CreateFormSchema =
  ApiPaths['/forms']['post']['requestBody']['content']['application/json'];
export type UpdateNotificationSettingsSchema =
  ApiPaths['/notifications/settings/me']['patch']['requestBody']['content']['application/json'];
