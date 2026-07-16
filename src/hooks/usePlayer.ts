'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { audioEngine } from '@/lib/player';
import { Song, EQSettings } from '@/types';

export function usePlayer() {
  const store = usePlayerStore();
  const queue = useQueueStore();
  const library = useLibraryStore();
  const initRef = useRef(false);

  // Initialize audio engine once
  useEffect(() => {
    if (!initRef.current) {
      audioEngine.init();
      initRef.current = true;

      audioEngine.onTimeUpdate((time) => {
        store.setProgress(time);
      });

      audioEngine.onEnded(() => {
        const nextSong = queue.next();
        if (nextSong) {
          playSong(nextSong);
        } else {
          store.setIsPlaying(false);
          store.setProgress(0);
        }
      });
    }
  }, []);

  // Sync volume
  useEffect(() => {
    audioEngine.setVolume(store.isMuted ? 0 : store.volume);
  }, [store.volume, store.isMuted]);

  // Sync EQ
  useEffect(() => {
    audioEngine.setEq(
      store.eqSettings.bass,
      store.eqSettings.mid,
      store.eqSettings.treble
    );
  }, [store.eqSettings]);

  const playSong = (song: Song) => {
    store.setCurrentSong(song);
    store.setIsPlaying(true);
    library.addToRecent(song);

    if (song.streamUrl) {
      audioEngine.load(song.streamUrl);
      audioEngine.play();
    }
  };

  const togglePlay = () => {
    if (!store.currentSong) {
      const song = queue.getCurrentSong();
      if (song) {
        playSong(song);
      }
      return;
    }
    if (store.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
    store.togglePlay();
  };

  const playNext = () => {
    const song = queue.next();
    if (song) {
      playSong(song);
    } else {
      store.reset();
    }
  };

  const playPrevious = () => {
    const song = queue.previous();
    if (song) {
      playSong(song);
    }
  };

  const seek = (time: number) => {
    audioEngine.seek(time);
    store.setProgress(time);
  };

  const setVolume = (volume: number) => {
    store.setVolume(volume);
    audioEngine.setVolume(volume);
  };

  const toggleMute = () => {
    store.toggleMute();
    audioEngine.setVolume(store.isMuted ? 0 : store.volume);
  };

  const setEq = (settings: Partial<EQSettings>) => {
    store.setEqSettings(settings);
  };

  return {
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
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
