'use client';

import type { NonEmptyArray } from '@/generic/Types';
import type { GetQuestionsResponse } from '@/lib/api-types';

/**
 * 回答フォーム内部で扱う入力値。
 * 質問タイプごとの違いを吸収して submit 前の共通形にしている。
 */
export interface AnswerFormInput {
  [key: string]: string | NonEmptyArray<string> | boolean;
}

export type AnswerQuestion = GetQuestionsResponse[number];

/**
 * 未ログイン回答で入力する投稿者情報のフィールド名。
 * 質問の回答（key は質問 UUID）と区別するため、衝突しない予約キーを使う。
 */
export const TEMPORARY_USER_FIELDS = {
  name: 'temporaryUser:name',
  contactText: 'temporaryUser:contact_text',
} as const;

export const isTemporaryUserField = (key: string): boolean =>
  key === TEMPORARY_USER_FIELDS.name ||
  key === TEMPORARY_USER_FIELDS.contactText;
