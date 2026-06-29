'use client';

import { useState } from 'react';
import { proxyClient } from '@/lib/proxyClient';
import { parseSubmissionError } from '../_lib/submissionErrors';
import { isTemporaryUserField, TEMPORARY_USER_FIELDS } from './answerFormTypes';
import type { AnswerFormInput } from './answerFormTypes';
import type { SubmissionError } from '../_lib/submissionErrors';
import type { ApiPaths } from '@/lib/api/types';

type AnswerCreateBody =
  ApiPaths['/api/v1/forms/{id}/answers']['post']['requestBody']['content']['application/json'];
type TemporaryAnswerCreateBody =
  ApiPaths['/api/v1/forms/{id}/temporary-answers']['post']['requestBody']['content']['application/json'];
type AnswerContents = AnswerCreateBody['contents'];

export type SubmissionState =
  | { kind: 'editing' }
  | { kind: 'submitted' }
  | { kind: 'failed'; error: SubmissionError };

// 質問の回答（key は質問 UUID）だけを contents に変換する。
// 未ログイン回答の投稿者情報フィールドは除外する。
const toAnswerContents = (data: AnswerFormInput): AnswerContents =>
  Object.entries(data)
    .filter(([key]) => !isTemporaryUserField(key))
    .flatMap(([key, values]) => {
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

      if (Array.isArray(values)) {
        return values.map((value) => ({
          question_id: key,
          answer: value,
        }));
      }

      // 未回答の任意質問など、想定外の値（undefined / null）は contents から除外する。
      return [];
    });

const toTemporaryUser = (
  data: AnswerFormInput
): TemporaryAnswerCreateBody['temporary_user'] => {
  const name = data[TEMPORARY_USER_FIELDS.name];
  const contactText = data[TEMPORARY_USER_FIELDS.contactText];

  return {
    name: typeof name === 'string' ? name.trim() : '',
    contact_text: typeof contactText === 'string' ? contactText.trim() : '',
  };
};

/**
 * 回答送信の state と API interaction を UI から分離する hook。
 * payload 変換と送信状態の更新はここを正本にする。
 */
export const useAnswerSubmission = (
  formId: string,
  isTemporary: boolean = false
) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    kind: 'editing',
  });

  const postAnswers = (data: AnswerFormInput) => {
    const params = { path: { id: formId } };

    if (isTemporary) {
      return proxyClient.POST('/api/v1/forms/{id}/temporary-answers', {
        params,
        body: {
          contents: toAnswerContents(data),
          temporary_user: toTemporaryUser(data),
        },
      });
    }

    return proxyClient.POST('/api/v1/forms/{id}/answers', {
      params,
      body: { contents: toAnswerContents(data) },
    });
  };

  const submitAnswers = async (data: AnswerFormInput) => {
    const { response, error } = await postAnswers(data);

    if (response.ok) {
      setSubmissionState({ kind: 'submitted' });
      return { ok: true as const };
    }

    const parsed = parseSubmissionError(error);
    const errorCode = parsed?.code ?? 'UNKNOWN';
    const submissionError = (() => {
      switch (errorCode) {
        case 'OUT_OF_PERIOD':
          return { kind: 'outOfPeriod' } satisfies SubmissionError;
        case 'RESTRICTED':
          return {
            kind: 'restricted',
            ...(parsed?.restriction ? { restriction: parsed.restriction } : {}),
          } satisfies SubmissionError;
        case 'UNKNOWN':
          return { kind: 'unknown' } satisfies SubmissionError;
      }
    })();
    setSubmissionState({ kind: 'failed', error: submissionError });

    return { ok: false as const, errorCode };
  };

  const resetSubmissionState = () => {
    setSubmissionState({ kind: 'editing' });
  };

  return {
    submissionState,
    submitAnswers,
    resetSubmissionState,
  };
};
