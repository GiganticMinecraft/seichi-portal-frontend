'use client';

import { useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useAnswerSubmitterRestrictionActions } from '@/hooks/useAnswerSubmitterRestrictionActions';

import CreateRestrictionForm from './CreateRestrictionForm';
import RestrictedAnswerSubmitterView from './RestrictedAnswerSubmitterView';
import { toRestrictionRequest } from './restrictionForm';
import type { RestrictionFormValues } from './restrictionForm';
import RestrictionStatusFeedback from './RestrictionStatusFeedback';

const RestrictionManagementSection = ({
  uuid,
  disabled,
}: {
  uuid: string;
  disabled: boolean;
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useApiQuery(
    '/api/v1/users/{uuid}/answer-submitter-restriction',
    { path: { uuid } }
  );

  const { restrictUser, unrestrictUser } =
    useAnswerSubmitterRestrictionActions();

  const handleRestrict = async (values: RestrictionFormValues) => {
    setSubmitError(null);
    const result = await restrictUser(uuid, toRestrictionRequest(values));
    if (result.success) {
      await mutate();
    } else {
      setSubmitError('制限の付与に失敗しました。');
    }
  };

  const handleUnrestrict = async () => {
    setSubmitError(null);
    const result = await unrestrictUser(uuid);
    if (result.success) {
      await mutate();
    } else {
      setSubmitError('制限の解除に失敗しました。');
    }
  };

  if (isLoading || error) {
    return <RestrictionStatusFeedback error={error} isLoading={isLoading} />;
  }

  if (data) {
    return (
      <RestrictedAnswerSubmitterView
        restriction={data}
        disabled={disabled}
        submitError={submitError}
        onUnrestrict={handleUnrestrict}
      />
    );
  }

  return (
    <CreateRestrictionForm
      disabled={disabled}
      submitError={submitError}
      onSubmit={handleRestrict}
    />
  );
};

export default RestrictionManagementSection;
