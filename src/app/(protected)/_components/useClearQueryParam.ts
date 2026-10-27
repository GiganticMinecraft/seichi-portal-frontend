'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 現在の URL から特定のクエリパラメータだけを取り除く関数を返す。
 * 対象のクエリが既に存在しない場合は何もしない(router.replace を呼ばない)。
 *
 * 回答詳細ページ(AnswerDetailsPageContent、standard/admin 共通)の
 * 直リンク(`messageId`/`commentId`)や、ユーザー情報ページの Discord 連携エラー
 * (`discordLinkError`)のように、一度表示したら URL から消したいクエリの後始末に使う。
 */
export const useClearQueryParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (key: string) => {
      if (searchParams.get(key) === null) {
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );
};
