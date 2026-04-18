'use client';

import Labels from '@/app/(authed)/_components/Labels';
import type { GetAnswerLabelsResponse } from '@/lib/api-types';

const AnswerLabels = (props: { labels: GetAnswerLabelsResponse }) => (
  <Labels
    labels={props.labels}
    deleteEndpointBase="/api/proxy/forms/answers/labels"
    editEndpointBase="/api/proxy/forms/labels/answers"
  />
);

export default AnswerLabels;
