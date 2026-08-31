import type { GetAnswerResponse } from '@/lib/api-types';

type Author = GetAnswerResponse['author'];

/**
 * author が undefined になるのは、フォームの回答詳細公開設定が RESTRICTED で、
 * かつ非管理者が自分自身の投稿した回答を閲覧しているときだけ(バックエンドの
 * answer_response_visibility_for の判定による、管理者や他人の回答閲覧では
 * 常に author が含まれる)。そのため author 不在それ自体が「本人の回答である」
 * ことの確証になり、undefined を isAuthor=false として扱ってはいけない。
 */
export const isAnswerAuthoredByCurrentUser = (
  author: Author,
  currentUserId: string,
  isAdmin: boolean
): boolean =>
  author === undefined
    ? !isAdmin
    : author.type === 'AUTHENTICATED_USER' &&
      author.user.uuid === currentUserId;

/** 上記と同じ理由により、author 不在は必ず認証済みユーザー自身の回答を意味する。 */
export const isAnswerFromAuthenticatedUser = (author: Author): boolean =>
  author === undefined || author.type === 'AUTHENTICATED_USER';
