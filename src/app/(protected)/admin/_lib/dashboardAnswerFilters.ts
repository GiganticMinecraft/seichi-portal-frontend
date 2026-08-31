import type { GetAnswersResponse } from '@/lib/api-types';

export interface DashboardAnswerFilter {
  /** 選択中のフォーム ID。空配列のときは絞り込まない。 */
  formIds: string[];
  /** 絞り込み対象期間。ISO 8601 文字列で、両端を含む。未指定(null)のときはその端を絞り込まない。 */
  dateRange: {
    startIso: string | null;
    endIso: string | null;
  };
}

export const filterAnswersByFormAndDate = (
  answers: GetAnswersResponse,
  filter: DashboardAnswerFilter
): GetAnswersResponse => {
  const startMs =
    filter.dateRange.startIso === null
      ? null
      : Date.parse(filter.dateRange.startIso);
  const endMs =
    filter.dateRange.endIso === null
      ? null
      : Date.parse(filter.dateRange.endIso);

  return answers.filter((answer) => {
    if (filter.formIds.length > 0 && !filter.formIds.includes(answer.form_id)) {
      return false;
    }

    if (startMs === null && endMs === null) {
      return true;
    }

    // timestamp は回答者本人が RESTRICTED 設定のフォームで自分の回答を見ている
    // ときは undefined になる(非公開)。期間内かどうか判定できないため除外する。
    if (answer.timestamp === undefined) {
      return false;
    }

    const answerMs = Date.parse(answer.timestamp);
    if (startMs !== null && answerMs < startMs) {
      return false;
    }
    if (endMs !== null && answerMs > endMs) {
      return false;
    }

    return true;
  });
};
