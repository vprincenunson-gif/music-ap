'use client';

import { create } from 'zustand';
import { Song, QueueItem } from '@/types';

interface QueueStore {
  queue: QueueItem[];
  history: QueueItem[];
  currentIndex: number;

  addToQueue: (song: Song) => void;
  addToFront: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  next: () => Song | null;
  previous: () => Song | null;
  getCurrentSong: () => Song | null;
  getQueue: () => QueueItem[];
  setQueue: (songs: Song[]) => void;
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  queue: [],
  history: [],
  currentIndex: -1,

  addToQueue: (song) =>
    set((s) => ({
      queue: [...s.queue, { song, addedAt: Date.now() }],
    })),

  addToFront: (song) =>
    set((s) => ({
      queue: [{ song, addedAt: Date.now() }, ...s.queue],
    })),

  removeFromQueue: (index) =>
    set((s) => ({
      queue: s.queue.filter((_, i) => i !== index),
    })),

  reorderQueue: (fromIndex, toIndex) =>
    set((s) => {
      const newQueue = [...s.queue];
      const [item] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, item);
      return { queue: newQueue };
    }),

  clearQueue: () => set({ queue: [], currentIndex: -1 }),

  next: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return null;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) return null;
    set({ currentIndex: nextIndex });
    return queue[nextIndex]?.song ?? null;
  },

  previous: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return null;
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return null;
    set({ currentIndex: prevIndex });
    return queue[prevIndex]?.song ?? null;
  },

  getCurrentSong: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) return null;
    return queue[currentIndex]?.song ?? null;
  },

  getQueue: () => get().queue,

  setQueue: (songs) =>
    set({
      queue: songs.map((song) => ({ song, addedAt: Date.now() })),
      currentIndex: songs.length > 0 ? 0 : -1,
    }),
}));
