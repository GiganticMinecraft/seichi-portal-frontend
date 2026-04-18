'use client';

import Labels from '@/app/(authed)/_components/Labels';
import type { GetFormLabelsResponse } from '@/lib/api-types';

const FormLabels = (props: { labels: GetFormLabelsResponse }) => (
  <Labels
    labels={props.labels}
    deleteEndpointBase="/api/proxy/forms/labels/forms"
    editEndpointBase="/api/proxy/forms/labels/forms"
  />
);

export default FormLabels;
