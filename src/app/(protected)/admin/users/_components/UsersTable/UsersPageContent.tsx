'use client';

import { useEffect, useState } from 'react';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type { GetUserListPageResponse } from '@/lib/api-types';

import { toUserListRows } from '../../_lib/userListRows';

import UsersView from './UsersView';

const SEARCH_DEBOUNCE_MS = 300;

const UsersPageContent = ({
  initialUsers,
  currentUserId,
}: {
  initialUsers: GetUserListPageResponse;
  currentUserId: string;
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === '') {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim() === '') {
      setDebouncedSearch('');
    }
  };

  const isSearching = debouncedSearch !== '';

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
