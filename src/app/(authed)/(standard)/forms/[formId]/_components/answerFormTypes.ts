'use client';

import type { GetQuestionsResponse } from '@/lib/api-types';
import type { NonEmptyArray } from '@/generic/Types';

/**
 * 回答フォーム内部で扱う入力値。
 * 質問タイプごとの違いを吸収して submit 前の共通形にしている。
 */
export interface AnswerFormInput {
  [key: string]: string | NonEmptyArray<string> | boolean;
}

export type AnswerQuestion = GetQuestionsResponse[number];
