'use client';

import { Skeleton, Typography } from '@mui/material';

import { useApiQuery } from '@/app/_swr/useApiQuery';

/**
 * 回答が属するフォームの名前を表示する。
 * フォーム情報は行ごとに個別取得するが、SWR がリクエストキーで
 * 重複排除するため、同じ form_id を参照する行が複数あっても
 * 実際の HTTP リクエストは1回にまとまる。
 */
const AnswerFormNameLabel = ({ formId }: { formId: string }) => {
  const { data: form, error } = useApiQuery('/api/v1/forms/{form_id}', {
    path: { form_id: formId },
  });

  if (error) {
    return (
      <Typography component="span" variant="body2" color="textSecondary">
        (フォーム名を取得できません)
      </Typography>
    );
  }

  if (!form) {
    return (
      <Skeleton variant="text" width={96} sx={{ display: 'inline-block' }} />
    );
  }

  return (
    <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>
      {form.title}
    </Typography>
  );
};

export default AnswerFormNameLabel;
