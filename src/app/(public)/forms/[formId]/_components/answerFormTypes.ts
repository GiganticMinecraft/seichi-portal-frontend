'use client';

import type { GetQuestionsResponse } from '@/lib/api-types';

/**
 * 回答フォーム内部で扱う入力値。
 * 質問タイプごとの違いを吸収して submit 前の共通形にしている。
 */
export interface AnswerFormInput {
  [key: string]: string | string[] | boolean;
}

export type AnswerQuestion = GetQuestionsResponse[number];

type ChoiceQuestion = Extract<
  AnswerQuestion,
  { question_type: 'SingleChoice' | 'MultipleChoice' }
>;

export type AnswerChoice = ChoiceQuestion['choices'][number];

/**
 * 選択肢を一意に識別する key。
 * choice.id（未保存の選択肢では null になりうる）を優先し、無ければ表示順の index で代替する。
 * 選択肢のラベルが重複していても選択状態を取り違えないようにするために使う。
 */
export const getChoiceKey = (choice: AnswerChoice, index: number): string =>
  choice.id != null ? `id:${choice.id}` : `idx:${index}`;

/**
 * SingleChoice / MultipleChoice の回答値（getChoiceKey ベース）を、
 * 送信用の label ベースの値へ変換する。
 * API は選択肢を label(文字列) でしか受け付けないため、送信直前にここで変換する。
 */
export const resolveChoiceLabels = (
  data: AnswerFormInput,
  questions: GetQuestionsResponse
): AnswerFormInput => {
  const labelByKeyPerQuestion = new Map(
    questions
      .filter(
        (question): question is ChoiceQuestion =>
          question.question_type === 'SingleChoice' ||
          question.question_type === 'MultipleChoice'
      )
      .map((question) => [
        question.id,
        new Map(
          question.choices.map((choice, index) => [
            getChoiceKey(choice, index),
            choice.label,
          ])
        ),
      ])
  );

  return Object.fromEntries(
    Object.entries(data).map(([questionId, value]) => {
      const labelByKey = labelByKeyPerQuestion.get(questionId);
      if (!labelByKey) {
        return [questionId, value];
      }

      if (typeof value === 'string') {
        return [questionId, labelByKey.get(value) ?? value];
      }

      if (Array.isArray(value)) {
        return [questionId, value.map((key) => labelByKey.get(key) ?? key)];
      }

      return [questionId, value];
    })
  );
};

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
