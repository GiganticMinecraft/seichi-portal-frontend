'use client';

import CreateLabelField from '@/app/(authed)/_components/CreateLabelField';

const FormCreateLabelField = () => (
  <CreateLabelField createEndpoint="/api/proxy/forms/labels/forms" />
);

export default FormCreateLabelField;
