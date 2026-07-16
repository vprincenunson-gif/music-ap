'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { Song, EQSettings } from '@/types';
import {
  playVideo,
  pauseVideo,
  seekVideo,
  setVolume,
  getCurrentTime,
  getDuration,
} from '@/lib/youtube';

const PROGRESS_INTERVAL = 500;

export function usePlayer() {
  const store = usePlayerStore();
  const queue = useQueueStore();
  const library = useLibraryStore();
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      try {
        const time = getCurrentTime();
        const dur = getDuration();
        if (dur > 0) store.setDuration(dur);
        store.setProgress(time);
      } catch {}
    }, PROGRESS_INTERVAL);
  }, [store]);

  const stopPolling = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  // Sync volume
  useEffect(() => {
    setVolume(store.isMuted ? 0 : store.volume);
  }, [store.volume, store.isMuted]);

  // Cleanup
  useEffect(() => () => stopPolling(), [stopPolling]);

  const playSong = useCallback((song: Song) => {
    store.setCurrentSong(song);
    store.setIsPlaying(true);
    library.addToRecent(song);

    if (song.source === 'youtube' && song.sourceId) {
      playVideo(song.sourceId, {
        onEnded: () => {
          const next = queue.next();
          if (next) playSong(next);
          else { store.setIsPlaying(false); stopPolling(); }
        },
      });
      startPolling();
    }
  }, [store, library, queue, startPolling, stopPolling]);

  const togglePlay = useCallback(() => {
    if (!store.currentSong) {
      const song = queue.getCurrentSong();
      if (song) playSong(song);
      return;
    }
    if (store.isPlaying) {
      pauseVideo();
      stopPolling();
    } else if (store.currentSong.source === 'youtube' && store.currentSong.sourceId) {
      playVideo(store.currentSong.sourceId);
      startPolling();
    }
    store.togglePlay();
  }, [store, queue, playSong, startPolling, stopPolling]);

  const playNext = useCallback(() => {
    const song = queue.next();
    if (song) playSong(song);
    else { store.reset(); stopPolling(); }
  }, [queue, playSong, store, stopPolling]);

  const playPrevious = useCallback(() => {
    const song = queue.previous();
    if (song) playSong(song);
  }, [queue, playSong]);

  const seek = useCallback((time: number) => {
    seekVideo(time);
    store.setProgress(time);
  }, [store]);

  const changeVolume = useCallback((vol: number) => {
    store.setVolume(vol);
    setVolume(vol);
  }, [store]);

  const toggleMute = useCallback(() => {
    store.toggleMute();
    setVolume(store.isMuted ? 0 : store.volume);
  }, [store]);

  const setEq = useCallback((settings: Partial<EQSettings>) => {
    store.setEqSettings(settings);
  }, [store]);

  return {
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume: changeVolume,
    toggleMute,
    setEq,
    isPlaying: store.isPlaying,
    currentSong: store.currentSong,
    progress: store.progress,
    duration: store.duration,
    volume: store.volume,
    isMuted: store.isMuted,
    eqSettings: store.eqSettings,
  };
}
