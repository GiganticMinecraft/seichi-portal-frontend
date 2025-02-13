import { z } from 'zod';

/**
 * バックエンドサーバーからのレスポンススキーマの定義。
 */

export const errorResponseSchema = z.object({
  errorCode: z.string(),
  reason: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// GET /forms
export const getFormsResponseSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    response_period: z.object({
      start_at: z.string().datetime(),
      end_at: z.string().datetime(),
    }),
    labels: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
    answer_visibility: z.enum(['PUBLIC', 'PRIVATE']),
  })
  .array();

export type GetFormsResponse = z.infer<typeof getFormsResponseSchema>;

// POST /forms
export const createFormResponseSchema = z.object({
  id: z.string().uuid(),
});

export type CreateFormResponse = z.infer<typeof createFormResponseSchema>;

// GET /forms/:form_id
export const getFormResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  questions: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
      choices: z.string().array(),
      is_required: z.boolean(),
    })
    .array(),
  settings: z.object({
    response_period: z
      .object({
        start_at: z.string().nullable(),
        end_at: z.string().nullable(),
      })
      .nullable(),
    webhook_url: z.string().nullable(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    answer_visibility: z.enum(['PUBLIC', 'PRIVATE']),
    default_answer_title: z.string().nullable(),
  }),
  metadata: z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  }),
  labels: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
});

export type GetFormResponse = z.infer<typeof getFormResponseSchema>;

// GET /forms/:formId/questions
export const getQuestionsResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
    choices: z.string().array(),
    is_required: z.boolean(),
  })
  .array();

export type GetQuestionsResponse = z.infer<typeof getQuestionsResponseSchema>;

// GET /forms/answers
export const getAnswersResponseSchema = z
  .object({
    id: z.string().uuid(),
    user: z.object({
      uuid: z.string(),
      name: z.string(),
      role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
    }),
    timestamp: z.string().datetime(),
    form_id: z.string().uuid(),
    title: z.string(),
    answers: z
      .object({
        question_id: z.number(),
        answer: z.string(),
      })
      .array(),
    comments: z
      .object({
        comment_id: z.number(),
        content: z.string(),
        timestamp: z.string().datetime(),
        commented_by: z.object({
          uuid: z.string(),
          name: z.string(),
          role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
        }),
      })
      .array(),
    labels: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
  })
  .array();

export type GetAnswersResponse = z.infer<typeof getAnswersResponseSchema>;

// GET /forms/:formId/answers
export const getFormAnswersResponseSchema = z
  .object({
    id: z.string().uuid(),
    user: z.object({
      uuid: z.string(),
      name: z.string(),
      role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
    }),
    timestamp: z.string().datetime(),
    form_id: z.string().uuid(),
    title: z.string(),
    answers: z
      .object({
        question_id: z.number(),
        answer: z.string(),
      })
      .array(),
    comments: z
      .object({
        comment_id: z.number(),
        content: z.string(),
        timestamp: z.string().datetime(),
        commented_by: z.object({
          uuid: z.string(),
          name: z.string(),
          role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
        }),
      })
      .array(),
    labels: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
  })
  .array();

export type GetFormAnswersResponse = z.infer<
  typeof getFormAnswersResponseSchema
>;

// GET /forms/labels/answers
export const getAnswerLabelsResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .array();

export type GetAnswerLabelsResponse = z.infer<
  typeof getAnswerLabelsResponseSchema
>;

// GET /forms/labels/forms
export const getFormLabelsResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .array();

export type GetFormLabelsResponse = z.infer<typeof getFormLabelsResponseSchema>;

// GET /forms/answers/:answerId
export const getAnswerResponseSchema = z.object({
  id: z.string().uuid(),
  user: z.object({
    uuid: z.string(),
    name: z.string(),
    role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
  }),
  timestamp: z.string().datetime(),
  form_id: z.string().uuid(),
  title: z.string(),
  answers: z
    .object({
      question_id: z.number(),
      answer: z.string(),
    })
    .array(),
  comments: z
    .object({
      comment_id: z.number(),
      content: z.string(),
      timestamp: z.string().datetime(),
      commented_by: z.object({
        uuid: z.string(),
        name: z.string(),
        role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
      }),
    })
    .array(),
  labels: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
});

export type GetAnswerResponse = z.infer<typeof getAnswerResponseSchema>;

// GET /forms/answers/:answerId/messages
export const getMessagesResponseSchema = z
  .object({
    id: z.string(),
    body: z.string().uuid(),
    sender: z.object({
      uuid: z.string(),
      name: z.string(),
      role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
    }),
    timestamp: z.string().datetime(),
  })
  .array();

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>;

// GET /users/{uuid}
export const getUsersResponseSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
  discord_user_id: z.string().nullable(),
  discord_username: z.string().nullable(),
});

export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>;

// GET /user/list
export const getUserListResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
  })
  .array();

export type GetUserListResponse = z.infer<typeof getUserListResponseSchema>;

// GET /search
export const searchResponseSchema = z.object({
  forms: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      response_period: z.object({
        start_at: z.string().datetime(),
        end_at: z.string().datetime(),
      }),
      labels: z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .array(),
      answer_visibility: z.enum(['PUBLIC', 'PRIVATE']),
    })
    .array(),
  users: z
    .object({
      id: z.string(),
      name: z.string(),
      role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
    })
    .array(),
  answers: z
    .object({
      answer_id: z.number(),
      question_id: z.number(),
      answer: z.string(),
    })
    .array(),
  label_for_forms: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
  label_for_answers: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
  comments: z
    .object({
      answer_id: z.number(),
      id: z.number(),
      content: z.string(),
      commented_by: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
      }),
    })
    .array(),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// GET /notifications
export const getNotificationResponseSchema = z.object({
  id: z.string().uuid(),
  source_type: z.enum(['MESSAGE']),
  source_id: z.string().uuid(),
  is_read: z.boolean(),
});

export type GetNotificationResponse = z.infer<
  typeof getNotificationResponseSchema
>;
