import {
  toOptionalQueryState,
  toRequiredQueryState,
} from '@/app/_swr/queryState';
import type {
  AnswerComment,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
  GetUsersResponse,
} from '@/lib/api-types';
import type { QuerySnapshot } from '@/app/_swr/queryState';

export type AnswerDetailsPageData = {
  answer: GetAnswerResponse;
  form: GetFormResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
  currentUserId: string | undefined;
};

type BlockedQuery = 'form';

export type AnswerDetailsPageState =
  | { kind: 'loading'; blockedQueries: readonly BlockedQuery[] }
  | { kind: 'error'; error: unknown }
  | { kind: 'ready'; data: AnswerDetailsPageData };

export const toAnswerDetailsPageState = ({
  answer,
  form,
  currentUser,
  messages,
  comments,
}: {
  answer: QuerySnapshot<GetAnswerResponse>;
  form: QuerySnapshot<GetFormResponse>;
  currentUser: QuerySnapshot<GetUsersResponse>;
  messages: QuerySnapshot<GetMessagesResponse>;
  comments: QuerySnapshot<AnswerComment[]>;
}): AnswerDetailsPageState => {
  const answerState = toRequiredQueryState(answer);
  const formState = toRequiredQueryState(form, {
    enabled: answerState.kind === 'ready',
  });
  const currentUserState = toOptionalQueryState(currentUser);
  const messagesState = toRequiredQueryState(messages);
  const commentsState = toRequiredQueryState(comments);

  const requiredStates = [
    answerState,
    formState,
    messagesState,
    commentsState,
  ] as const;

  const errorState = requiredStates.find((state) => state.kind === 'error');
  if (errorState?.kind === 'error') {
    return { kind: 'error', error: errorState.error };
  }

  if (answerState.kind !== 'ready') {
    return { kind: 'loading', blockedQueries: ['form'] };
  }

  if (formState.kind === 'blocked') {
    return { kind: 'loading', blockedQueries: ['form'] };
  }

  if (
    formState.kind === 'loading' ||
    messagesState.kind === 'loading' ||
    commentsState.kind === 'loading'
  ) {
    return { kind: 'loading', blockedQueries: [] };
  }

  if (
    formState.kind !== 'ready' ||
    messagesState.kind !== 'ready' ||
    commentsState.kind !== 'ready'
  ) {
    return { kind: 'loading', blockedQueries: [] };
  }

  return {
    kind: 'ready',
    data: {
      answer: answerState.data,
      form: formState.data,
      messages: messagesState.data,
      comments: commentsState.data,
      currentUserId:
        currentUserState.kind === 'ready'
          ? currentUserState.data?.id
          : undefined,
    },
  };
};
