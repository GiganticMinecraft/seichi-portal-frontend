'use client';

import { useState } from 'react';
import type { paths } from '@/generated/api-types';
import { errorResponseSchema } from '@/lib/api/errors';
import { proxyClient } from '@/lib/proxyClient';
import type { AnswerFormInput } from './answerFormTypes';

type AnswerCreateBody =
  paths['/forms/{id}/answers']['post']['requestBody']['content']['application/json'];

type SubmissionErrorCode = 'OUT_OF_PERIOD';

const toAnswerCreateBody = (data: AnswerFormInput): AnswerCreateBody => ({
  contents: Object.entries(data).flatMap(([key, values]) => {
    if (typeof values === 'string') {
      return {
        question_id: key,
        answer: values,
      };
    }

    if (typeof values === 'boolean') {
      return [
        {
          question_id: key,
          answer: '',
        },
      ];
    }

    return values.map((value) => ({
      question_id: key,
      answer: value,
    }));
  }),
});

const parseSubmissionErrorCode = (
  error: unknown
): SubmissionErrorCode | null => {
  const parsed = errorResponseSchema.safeParse(error);

  if (!parsed.success) {
    return null;
  }

  if (parsed.data.errorCode === 'OUT_OF_PERIOD') {
    return 'OUT_OF_PERIOD';
  }

  return null;
};

/**
 * 回答送信の state と API interaction を UI から分離する hook。
 * payload 変換と API エラー解釈はここを正本にする。
 */
export const useAnswerSubmission = (formId: string) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionErrorCode, setSubmissionErrorCode] =
    useState<SubmissionErrorCode | null>(null);

  const submitAnswers = async (data: AnswerFormInput) => {
    const { response, error } = await proxyClient.POST('/forms/{id}/answers', {
      params: {
        path: {
          id: formId,
        },
      },
      body: toAnswerCreateBody(data),
    });

    if (response.ok) {
      setIsSubmitted(true);
      setSubmissionErrorCode(null);
      return { ok: true as const };
    }

    const errorCode = parseSubmissionErrorCode(error);
    setSubmissionErrorCode(errorCode);

    return { ok: false as const, errorCode };
  };

  const resetSubmissionState = () => {
    setIsSubmitted(false);
    setSubmissionErrorCode(null);
  };

  return {
    isSubmitted,
    submissionErrorCode,
    submitAnswers,
    resetSubmissionState,
  };
};
