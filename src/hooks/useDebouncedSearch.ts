'use client';

import { useEffect, useState } from 'react';

const SEARCH_DEBOUNCE_MS = 300;

// 検索欄をクリアした場合のみ即時反映し、それ以外は入力を SEARCH_DEBOUNCE_MS だけ遅延させて確定させる
export const useDebouncedSearch = (initialValue = '') => {
  const [search, setSearch] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

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

  const setValue = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
  };

  return {
    search,
    debouncedSearch,
    isSearching: debouncedSearch !== '',
    handleSearchChange,
    setValue,
  };
};
