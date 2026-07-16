'use client';

import { useState, useEffect, useCallback } from 'react';
import { Song } from '@/types';
import { getAllCachedSongs, removeCachedSong, getCacheInfo } from '@/lib/offline';

export function useOffline() {
  const [cachedSongs, setCachedSongs] = useState<Song[]>([]);
  const [cacheInfo, setCacheInfo] = useState<{ songs: number; size: string }>({ songs: 0, size: '0 MB' });
  const [isLoading, setIsLoading] = useState(true);

  const refreshCache = useCallback(async () => {
    setIsLoading(true);
    try {
      const songs = await getAllCachedSongs();
      setCachedSongs(songs);
      const info = await getCacheInfo();
      setCacheInfo(info);
    } catch (err) {
      console.error('Failed to refresh cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeSong = async (songId: string) => {
    await removeCachedSong(songId);
    await refreshCache();
  };

  return {
    cachedSongs,
    cacheInfo,
    isLoading,
    refreshCache,
    removeSong,
  };
}
