'use client';

import Labels from '@/app/(authed)/_components/Labels';
import type { GetAnswerLabelsResponse } from '@/lib/api-types';

const AnswerLabels = (props: { labels: GetAnswerLabelsResponse }) => (
  <Labels labels={props.labels} labelType="answers" />
);

export default AnswerLabels;
