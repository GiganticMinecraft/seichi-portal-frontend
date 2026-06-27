'use client';

import { useState } from 'react';
import { errorResponseSchema } from '@/lib/api/errors';
import { proxyClient } from '@/lib/proxyClient';
import type { AnswerFormInput } from './answerFormTypes';
import type { ErrorRestriction } from '@/lib/api/errors';
import type { ApiPaths } from '@/lib/api/types';

type AnswerCreateBody =
  ApiPaths['/api/v1/forms/{id}/answers']['post']['requestBody']['content']['application/json'];

type SubmissionErrorCode = 'OUT_OF_PERIOD' | 'RESTRICTED' | 'UNKNOWN';

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

type ParsedSubmissionError = {
  code: SubmissionErrorCode;
  restriction?: ErrorRestriction;
};

const parseSubmissionError = (error: unknown): ParsedSubmissionError | null => {
  const parsed = errorResponseSchema.safeParse(error);

  if (!parsed.success) {
    return null;
  }

  // 回答投稿制限によるエラーは errorCode で判定する（restriction の有無に依存しない）。
  if (parsed.data.errorCode === 'ANSWER_SUBMISSION_RESTRICTED') {
    return {
      code: 'RESTRICTED',
      ...(parsed.data.restriction
        ? { restriction: parsed.data.restriction }
        : {}),
    };
  }

  if (parsed.data.errorCode === 'OUT_OF_PERIOD') {
    return { code: 'OUT_OF_PERIOD' };
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
  const [restriction, setRestriction] = useState<ErrorRestriction | null>(null);

  const submitAnswers = async (data: AnswerFormInput) => {
    const { response, error } = await proxyClient.POST(
      '/api/v1/forms/{id}/answers',
      {
        params: {
          path: {
            id: formId,
          },
        },
        body: toAnswerCreateBody(data),
      }
    );

    if (response.ok) {
      setIsSubmitted(true);
      setSubmissionErrorCode(null);
      setRestriction(null);
      return { ok: true as const };
    }

    const parsed = parseSubmissionError(error);
    const errorCode = parsed?.code ?? 'UNKNOWN';
    setSubmissionErrorCode(errorCode);
    setRestriction(parsed?.restriction ?? null);

    return { ok: false as const, errorCode };
  };

  const resetSubmissionState = () => {
    setIsSubmitted(false);
    setSubmissionErrorCode(null);
    setRestriction(null);
  };

  return {
    isSubmitted,
    submissionErrorCode,
    restriction,
    submitAnswers,
    resetSubmissionState,
  };
};
