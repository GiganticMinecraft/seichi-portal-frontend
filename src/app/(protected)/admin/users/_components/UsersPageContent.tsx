'use client';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type { GetUserListPageResponse } from '@/lib/api-types';

import { toUserListRows } from '../_lib/userListRows';

import UsersView from './UsersView';

const UsersPageContent = ({
  initialUsers,
  currentUserId,
}: {
  initialUsers: GetUserListPageResponse;
  currentUserId: string;
}) => {
  const {
    items: users,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteApiQuery(
    '/api/v1/users',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    initialUsers
  );
  const rows = toUserListRows(users, currentUserId);

  return (
    <>
      <UsersView rows={rows} />
      {hasMore && (
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </>
  );
};

export default UsersPageContent;
