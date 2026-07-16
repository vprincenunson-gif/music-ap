'use client';

import { create } from 'zustand';
import { Song, PlayerState, EQSettings } from '@/types';

interface PlayerStore extends PlayerState {
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  setEqSettings: (settings: Partial<EQSettings>) => void;
  reset: () => void;
}

const defaultEq: EQSettings = { bass: 0, mid: 0, treble: 0 };

export const usePlayerStore = create<PlayerStore>((set) => {
  return {
    currentSong: null,
    isPlaying: false,
    volume: 0.7,
    progress: 0,
    duration: 0,
    isMuted: false,
    repeatMode: 'none' as const,
    isShuffled: false,
    eqSettings: { ...defaultEq },

    setCurrentSong: (song: Song | null) => set({ currentSong: song, progress: 0 }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
    setVolume: (volume: number) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    setProgress: (progress: number) => set({ progress }),
    setDuration: (duration: number) => set({ duration }),
    toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
    setRepeatMode: (mode) => set({ repeatMode: mode }),
    toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),
    setEqSettings: (settings: Partial<EQSettings>) => set((s) => ({ eqSettings: { ...s.eqSettings, ...settings } })),
    reset: () => set({ currentSong: null, isPlaying: false, progress: 0, duration: 0 }),
  };
});
