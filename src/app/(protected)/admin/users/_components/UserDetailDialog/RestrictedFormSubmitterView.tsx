import { Alert, Button, Stack, Tooltip, Typography } from '@mui/material';

import { formatString } from '@/generic/DateFormatter';
import type { GetFormSubmissionRestrictionResponse } from '@/lib/api-types';
import {
  formatRestrictionExpiration,
  toRestrictionExpiration,
} from '@/lib/restrictions/expiration';

const RestrictedFormSubmitterView = ({
  restriction,
  disabled,
  submitError,
  onUnrestrict,
}: {
  restriction: NonNullable<GetFormSubmissionRestrictionResponse>;
  disabled: boolean;
  submitError: string | null;
  onUnrestrict: () => Promise<void>;
}) => {
  const expiration = toRestrictionExpiration(restriction.expires_at);

  return (
    <Stack spacing={1.5}>
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <Stack spacing={0.5}>
        <Typography component="p">
          <strong>理由:</strong> {restriction.reason}
        </Typography>
        <Typography component="p">
          <strong>制限日時:</strong> {formatString(restriction.restricted_at)}
        </Typography>
        <Typography component="p">
          <strong>解除予定:</strong> {formatRestrictionExpiration(expiration)}
        </Typography>
      </Stack>
      <Tooltip
        title={disabled ? '自分自身は制限できません' : ''}
        placement="top"
      >
        <span>
          <Button
            color="error"
            variant="outlined"
            size="small"
            disabled={disabled}
            onClick={() => {
              void onUnrestrict();
            }}
          >
            制限を解除する
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default RestrictedFormSubmitterView;
