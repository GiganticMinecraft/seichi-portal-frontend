'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { GetUserListPageResponse } from '@/lib/api-types';

import { toUserListRows } from '../../_lib/userListRows';

import UsersView from './UsersView';

const UsersPageContent = ({
  initialUsers,
  currentUserId,
}: {
  initialUsers: GetUserListPageResponse;
  currentUserId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const autoOpenUserId = searchParams.get('userId');
  const autoOpenUserName = searchParams.get('userName');

  const { search, debouncedSearch, isSearching, handleSearchChange, setValue } =
    useDebouncedSearch(autoOpenUserName ?? '');

  const [prevAutoOpenUserName, setPrevAutoOpenUserName] =
    useState(autoOpenUserName);
  if (autoOpenUserName !== prevAutoOpenUserName) {
    setPrevAutoOpenUserName(autoOpenUserName);
    if (autoOpenUserName) {
      setValue(autoOpenUserName);
    }
  }

  useEffect(() => {
    if (autoOpenUserId) {
      router.replace(pathname);
    }
  }, [autoOpenUserId, pathname, router]);

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

  const { data: searchData, isLoading: isSearchLoading } = useApiQuery(
    '/api/v1/search/users',
    isSearching ? { query: { query: debouncedSearch } } : null,
    { keepPreviousData: true }
  );

  const rows = isSearching
    ? toUserListRows(searchData?.users ?? [], currentUserId)
    : toUserListRows(users, currentUserId);

  return (
    <>
      <UsersView
        rows={rows}
        search={search}
        onSearchChange={handleSearchChange}
        isLoading={isSearching && isSearchLoading}
        autoOpenUserId={autoOpenUserId}
      />
      {!isSearching && hasMore && (
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </>
  );
};

export default UsersPageContent;
