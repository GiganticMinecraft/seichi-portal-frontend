import { toRequiredQueryState } from '@/app/_swr/queryState';
import type { QuerySnapshot } from '@/app/_swr/queryState';
import type {
  AnswerComment,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';

type AdminAnswer = GetAnswersResponse[number];
type BlockedQuery = 'form' | 'messages' | 'comments';

export type AdminAnswerPageData = {
  answer: AdminAnswer;
  form: GetFormResponse;
  labels: GetAnswerLabelsResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
};

export type AdminAnswerPageState =
  | { kind: 'loading'; blockedQueries: readonly BlockedQuery[] }
  | { kind: 'error'; error: unknown }
  | { kind: 'notFound' }
  | { kind: 'ready'; data: AdminAnswerPageData };

export const toAdminAnswerPageState = ({
  answerId,
  allAnswers,
  form,
  labels,
  messages,
  comments,
}: {
  answerId: string;
  allAnswers: QuerySnapshot<GetAnswersResponse>;
  form: QuerySnapshot<GetFormResponse>;
  labels: QuerySnapshot<GetAnswerLabelsResponse>;
  messages: QuerySnapshot<GetMessagesResponse>;
  comments: QuerySnapshot<AnswerComment[]>;
}): AdminAnswerPageState => {
  const allAnswersState = toRequiredQueryState(allAnswers);
  const answer =
    allAnswersState.kind === 'ready'
      ? allAnswersState.data.find((item) => item.id === answerId)
      : undefined;
  const hasAnswer = answer !== undefined;

  const formState = toRequiredQueryState(form, { enabled: hasAnswer });
  const labelsState = toRequiredQueryState(labels);
  const messagesState = toRequiredQueryState(messages, { enabled: hasAnswer });
  const commentsState = toRequiredQueryState(comments, { enabled: hasAnswer });

  const requiredStates = [
    allAnswersState,
    formState,
    labelsState,
    messagesState,
    commentsState,
  ] as const;

  const errorState = requiredStates.find((state) => state.kind === 'error');
  if (errorState?.kind === 'error') {
    return { kind: 'error', error: errorState.error };
  }

  if (allAnswersState.kind !== 'ready') {
    return {
      kind: 'loading',
      blockedQueries: ['form', 'messages', 'comments'],
    };
  }

  if (!hasAnswer) {
    return { kind: 'notFound' };
  }

  if (
    formState.kind === 'blocked' ||
    messagesState.kind === 'blocked' ||
    commentsState.kind === 'blocked'
  ) {
    return {
      kind: 'loading',
      blockedQueries: ['form', 'messages', 'comments'],
    };
  }

  if (
    formState.kind === 'loading' ||
    labelsState.kind === 'loading' ||
    messagesState.kind === 'loading' ||
    commentsState.kind === 'loading'
  ) {
    return { kind: 'loading', blockedQueries: [] };
  }

  if (
    formState.kind !== 'ready' ||
    labelsState.kind !== 'ready' ||
    messagesState.kind !== 'ready' ||
    commentsState.kind !== 'ready'
  ) {
    return { kind: 'loading', blockedQueries: [] };
  }

  return {
    kind: 'ready',
    data: {
      answer,
      form: formState.data,
      labels: labelsState.data,
      messages: messagesState.data,
      comments: commentsState.data,
    },
  };
};
