import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const FormLabelResponseSchema = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const FormMetaSchema = z
  .object({
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
  })
  .passthrough();
const QuestionResponseSchema = z
  .object({
    choices: z.array(z.string()),
    description: z.union([z.string(), z.null()]).optional(),
    form_id: z.string(),
    id: z.union([z.number(), z.null()]).optional(),
    is_required: z.boolean(),
    question_type: z.string(),
    title: z.string(),
  })
  .passthrough();
const ResponsePeriodInput = z
  .object({
    end_at: z.union([z.string(), z.null()]),
    start_at: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();
const AnswerSettingsSchema = z
  .object({
    default_answer_title: z.union([z.string(), z.null()]),
    response_period: z.union([z.null(), ResponsePeriodInput]),
    visibility: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();
const FormSettingsSchema = z
  .object({
    answer_settings: z.union([z.null(), AnswerSettingsSchema]),
    visibility: z.union([z.string(), z.null()]),
    webhook_url: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();
const FormSchema = z
  .object({
    description: z.string(),
    id: z.string().uuid(),
    labels: z.array(FormLabelResponseSchema),
    metadata: FormMetaSchema,
    questions: z.array(QuestionResponseSchema),
    settings: FormSettingsSchema,
    title: z.string(),
  })
  .passthrough();
const FormCreateSchema = z
  .object({ description: z.string(), title: z.string() })
  .passthrough();
const AnswerContent = z
  .object({ answer: z.string(), question_id: z.number().int() })
  .passthrough();
const Role = z.enum(["STANDARD_USER", "ADMINISTRATOR"]);
const User = z
  .object({ name: z.string(), role: Role, uuid: z.string() })
  .passthrough();
const AnswerComment = z
  .object({
    commented_by: User,
    content: z.string(),
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough();
const AnswerLabels = z
  .object({ id: z.string().uuid(), name: z.string() })
  .passthrough();
const FormAnswer = z
  .object({
    answers: z.array(AnswerContent),
    comments: z.array(AnswerComment),
    form_id: z.string().uuid(),
    id: z.string().uuid(),
    labels: z.array(AnswerLabels),
    timestamp: z.string().datetime({ offset: true }),
    title: z.union([z.string(), z.null()]).optional(),
    user: User,
  })
  .passthrough();
const ReplaceAnswerLabelSchema = z
  .object({ labels: z.array(z.string()) })
  .passthrough();
const AnswerUpdateSchema = z
  .object({ title: z.union([z.string(), z.null()]) })
  .partial()
  .passthrough();
const NonEmptyString = z.string();
const CommentPostSchema = z
  .object({ content: NonEmptyString.min(1) })
  .passthrough();
const CommentUpdateSchema = z
  .object({ content: z.union([z.null(), NonEmptyString]) })
  .partial()
  .passthrough();
const SenderSchema = z
  .object({ name: z.string(), role: z.string(), uuid: z.string() })
  .passthrough();
const MessageContentSchema = z
  .object({
    body: z.string(),
    id: z.string().uuid(),
    sender: SenderSchema,
    timestamp: z.string().datetime({ offset: true }),
  })
  .passthrough();
const PostedMessageSchema = z.object({ body: z.string() }).passthrough();
const MessageUpdateSchema = z
  .object({ body: z.union([z.string(), z.null()]) })
  .partial()
  .passthrough();
const ReplaceFormLabelSchema = z
  .object({ labels: z.array(z.string()) })
  .passthrough();
const FormUpdateSchema = z
  .object({
    description: z.union([z.string(), z.null()]),
    settings: z.union([z.null(), FormSettingsSchema]),
    title: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();
const AnswerContentSchema = z
  .object({ answer: z.string(), question_id: z.number().int() })
  .passthrough();
const AnswerCreateSchema = z
  .object({ contents: z.array(AnswerContentSchema) })
  .passthrough();
const QuestionSchema = z
  .object({
    choices: z.array(z.string()).optional(),
    description: z.union([z.string(), z.null()]).optional(),
    id: z.union([z.number(), z.null()]).optional(),
    is_required: z.boolean(),
    question_type: z.string(),
    title: z.string(),
  })
  .passthrough();
const FormQuestionPutSchema = z
  .object({ questions: z.array(QuestionSchema) })
  .partial()
  .passthrough();
const PutQuestionsResponseSchema = z
  .object({ questions: z.array(QuestionResponseSchema) })
  .passthrough();
const AnswerLabelResponseSchema = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const AnswerLabelSchema = z
  .object({ name: NonEmptyString.min(1) })
  .passthrough();
const AnswerLabelUpdateSchema = z
  .object({ name: z.union([z.null(), NonEmptyString]) })
  .partial()
  .passthrough();
const FormLabelCreateSchema = z
  .object({ name: NonEmptyString.min(1) })
  .passthrough();
const FormLabelUpdateSchema = z
  .object({ name: z.union([z.null(), NonEmptyString]) })
  .partial()
  .passthrough();
const DiscordOAuthToken = z.object({ token: z.string() }).passthrough();
const NotificationSettingsResponse = z
  .object({ is_send_message_notification: z.boolean() })
  .passthrough();
const NotificationSettingsUpdateSchema = z
  .object({ is_send_message_notification: z.union([z.boolean(), z.null()]) })
  .partial()
  .passthrough();
const CommentSchema = z
  .object({
    answer_id: z.string().uuid(),
    commented_by: z.string().uuid(),
    content: z.string(),
    id: z.string().uuid(),
  })
  .passthrough();
const CrossSearchResult = z
  .object({
    answers: z.array(z.unknown()),
    comments: z.array(CommentSchema),
    forms: z.array(z.unknown()),
    label_for_answers: z.array(z.unknown()),
    label_for_forms: z.array(z.unknown()),
    users: z.array(z.unknown()),
  })
  .passthrough();
const SessionCreateSchema = z
  .object({ expires: z.number().int().gte(0) })
  .passthrough();
const UserSchema = z
  .object({ id: z.string(), name: z.string(), role: z.string() })
  .passthrough();
const UserInfoResponse = z
  .object({
    discord_user_id: z.union([z.string(), z.null()]).optional(),
    discord_username: z.union([z.string(), z.null()]).optional(),
    id: z.string(),
    name: z.string(),
    role: z.string(),
  })
  .passthrough();
const UserUpdateSchema = z
  .object({
    id: z.union([z.string(), z.null()]),
    name: z.union([z.string(), z.null()]),
    role: z.union([z.string(), z.null()]),
  })
  .partial()
  .passthrough();

export const schemas = {
  FormLabelResponseSchema,
  FormMetaSchema,
  QuestionResponseSchema,
  ResponsePeriodInput,
  AnswerSettingsSchema,
  FormSettingsSchema,
  FormSchema,
  FormCreateSchema,
  AnswerContent,
  Role,
  User,
  AnswerComment,
  AnswerLabels,
  FormAnswer,
  ReplaceAnswerLabelSchema,
  AnswerUpdateSchema,
  NonEmptyString,
  CommentPostSchema,
  CommentUpdateSchema,
  SenderSchema,
  MessageContentSchema,
  PostedMessageSchema,
  MessageUpdateSchema,
  ReplaceFormLabelSchema,
  FormUpdateSchema,
  AnswerContentSchema,
  AnswerCreateSchema,
  QuestionSchema,
  FormQuestionPutSchema,
  PutQuestionsResponseSchema,
  AnswerLabelResponseSchema,
  AnswerLabelSchema,
  AnswerLabelUpdateSchema,
  FormLabelCreateSchema,
  FormLabelUpdateSchema,
  DiscordOAuthToken,
  NotificationSettingsResponse,
  NotificationSettingsUpdateSchema,
  CommentSchema,
  CrossSearchResult,
  SessionCreateSchema,
  UserSchema,
  UserInfoResponse,
  UserUpdateSchema,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/forms",
    alias: "form_list_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
    ],
    response: z.array(FormSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/forms",
    alias: "create_form_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormCreateSchema,
      },
    ],
    response: FormSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:form_id/answers/:answer_id",
    alias: "get_answer_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FormAnswer,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/forms/:form_id/answers/:answer_id",
    alias: "update_answer_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AnswerUpdateSchema,
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FormAnswer,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:form_id/answers/:answer_id/comments",
    alias: "get_form_comment",
    requestFormat: "json",
    parameters: [
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(AnswerComment),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/forms/:form_id/answers/:answer_id/comments",
    alias: "post_form_comment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CommentPostSchema,
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/forms/:form_id/answers/:answer_id/comments/:comment_id",
    alias: "delete_form_comment_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "comment_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/forms/:form_id/answers/:answer_id/comments/:comment_id",
    alias: "update_form_comment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CommentUpdateSchema,
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "comment_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:form_id/answers/:answer_id/messages",
    alias: "get_messages_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(MessageContentSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/forms/:form_id/answers/:answer_id/messages",
    alias: "post_message_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ body: z.string() }).passthrough(),
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/forms/:form_id/answers/:answer_id/messages/:message_id",
    alias: "delete_message_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "message_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/forms/:form_id/answers/:answer_id/messages/:message_id",
    alias: "update_message_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: MessageUpdateSchema,
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "message_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/forms/:form_id/labels",
    alias: "replace_form_labels",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ReplaceFormLabelSchema,
      },
      {
        name: "form_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:id",
    alias: "get_form_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FormSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/forms/:id",
    alias: "delete_form_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/forms/:id",
    alias: "update_form_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormUpdateSchema,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FormSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:id/answers",
    alias: "get_answer_by_form_id_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(FormAnswer),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/forms/:id/answers",
    alias: "post_answer_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AnswerCreateSchema,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/:id/questions",
    alias: "get_questions_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(QuestionResponseSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/forms/:id/questions",
    alias: "put_question_handler",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormQuestionPutSchema,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: PutQuestionsResponseSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/forms/answers",
    alias: "get_all_answers",
    requestFormat: "json",
    response: z.array(FormAnswer),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/forms/answers/:answer_id/labels",
    alias: "replace_answer_labels",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ReplaceAnswerLabelSchema,
      },
      {
        name: "answer_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/health",
    alias: "health_check",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 503,
        description: `One or more dependencies are unavailable.`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/labels/answers",
    alias: "get_labels_for_answers",
    requestFormat: "json",
    response: z.array(AnswerLabelResponseSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/labels/answers",
    alias: "create_label_for_answers",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AnswerLabelSchema,
      },
    ],
    response: AnswerLabelResponseSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/labels/answers/:label_id",
    alias: "delete_label_for_answers",
    requestFormat: "json",
    parameters: [
      {
        name: "label_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/labels/answers/:label_id",
    alias: "edit_label_for_answers",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AnswerLabelUpdateSchema,
      },
      {
        name: "label_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: AnswerLabelResponseSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/labels/forms",
    alias: "get_labels_for_forms",
    requestFormat: "json",
    response: z.array(FormLabelResponseSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/labels/forms",
    alias: "create_label_for_forms",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormLabelCreateSchema,
      },
    ],
    response: FormLabelResponseSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/labels/forms/:label_id",
    alias: "delete_label_for_forms",
    requestFormat: "json",
    parameters: [
      {
        name: "label_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/labels/forms/:label_id",
    alias: "edit_label_for_forms",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormLabelUpdateSchema,
      },
      {
        name: "label_id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/link-discord",
    alias: "link_discord",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string() }).passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/link-discord",
    alias: "unlink_discord",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/notifications/settings/:uuid",
    alias: "get_notification_settings",
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ is_send_message_notification: z.boolean() })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/notifications/settings/me",
    alias: "get_my_notification_settings",
    requestFormat: "json",
    response: z
      .object({ is_send_message_notification: z.boolean() })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/notifications/settings/me",
    alias: "update_notification_settings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: NotificationSettingsUpdateSchema,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/search",
    alias: "cross_search",
    requestFormat: "json",
    parameters: [
      {
        name: "query",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: CrossSearchResult,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/session",
    alias: "start_session",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ expires: z.number().int().gte(0) }).passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/session",
    alias: "end_session",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/users",
    alias: "user_list",
    requestFormat: "json",
    response: z.array(UserSchema),
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/:uuid",
    alias: "get_user_info",
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UserInfoResponse,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/users/:uuid",
    alias: "patch_user_role",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserUpdateSchema,
      },
      {
        name: "uuid",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UserSchema,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `The server cannot find the requested resource.`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `Client error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/me",
    alias: "get_my_user_info",
    requestFormat: "json",
    response: UserInfoResponse,
    errors: [
      {
        status: 400,
        description: `The server could not understand the request due to invalid syntax.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Access is unauthorized.`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Access is forbidden.`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Server error`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
