'use client';

import Labels from '@/app/(authed)/_components/Labels';
import type { GetFormLabelsResponse } from '@/lib/api-types';

const FormLabels = (props: { labels: GetFormLabelsResponse }) => (
  <Labels
    labels={props.labels}
    deleteEndpointBase="/api/proxy/labels/forms"
    editEndpointBase="/api/proxy/labels/forms"
  />
);

export default FormLabels;
