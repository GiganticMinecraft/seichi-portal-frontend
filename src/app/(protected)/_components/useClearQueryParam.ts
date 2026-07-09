'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 現在の URL から特定のクエリパラメータだけを取り除く関数を返す。
 * 対象のクエリが既に存在しない場合は何もしない(router.replace を呼ばない)。
 *
 * standard 側(AnswerDetailsPageContent)・admin 側(AdminAnswerPageContent)の
 * 両方で、直リンク(`messageId`/`commentId`)の後始末に使われる共通処理。
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
