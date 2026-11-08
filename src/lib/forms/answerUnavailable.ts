import { isHttpError } from '@/lib/httpError';
import type { HttpError } from '@/lib/httpError';

/**
 * 回答詳細を表示できない理由。
 *
 * - `form-not-found`: フォームがアーカイブまたは削除された (backend の `FORM_NOT_FOUND`)
 * - `answer-not-found`: 回答が削除された (`ANSWER_NOT_FOUND`、または errorCode の無い 404)
 */
export type AnswerUnavailableReason = 'form-not-found' | 'answer-not-found';

const isNotFound = (error: unknown): error is HttpError =>
  isHttpError(error) && error.status === 404;

/**
 * 回答詳細を構成するクエリ (回答本体・関連回答・コメントなど) のエラーから、
 * 回答を表示できない理由を求める。
 *
 * これらのクエリは同時に始まるため、どれが先に 404 を返すかは分からない。
 * いずれかが 404 なら「表示できない」とみなし、`FORM_NOT_FOUND` が 1 つでもあれば
 * フォーム側の理由を優先する。404 以外のエラーは対象外 (`undefined`) とし、
 * 呼び出し側の通常のエラー処理に任せる。
 */
export const resolveAnswerUnavailableReason = (
  errors: readonly unknown[]
): AnswerUnavailableReason | undefined => {
  const notFoundErrors = errors.filter(isNotFound);

  if (notFoundErrors.length === 0) {
    return undefined;
  }

  return notFoundErrors.some((error) => error.errorCode === 'FORM_NOT_FOUND')
    ? 'form-not-found'
    : 'answer-not-found';
};
