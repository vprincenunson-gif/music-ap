'use client';

import { useState, useCallback } from 'react';
import { Song } from '@/types';
import { searchMock } from '@/lib/soundcloud';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const songs = await searchMock(q);
      setResults(songs);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    search,
    clearSearch,
  };
}
