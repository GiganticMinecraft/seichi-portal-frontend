'use client';

import CreateLabelField from '@/app/(authed)/_components/CreateLabelField';

const AnswerCreateLabelField = () => (
  <CreateLabelField createEndpoint="/api/proxy/forms/labels/answers" />
);

export default AnswerCreateLabelField;
