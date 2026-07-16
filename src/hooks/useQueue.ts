'use client';

import { useQueueStore } from '@/stores/queueStore';
import { Song } from '@/types';

export function useQueue() {
  const store = useQueueStore();

  return {
    queue: store.queue,
    currentIndex: store.currentIndex,
    currentSong: store.getCurrentSong(),
    addToQueue: store.addToQueue,
    addToFront: store.addToFront,
    removeFromQueue: store.removeFromQueue,
    reorderQueue: store.reorderQueue,
    clearQueue: store.clearQueue,
    setQueue: store.setQueue,
    next: store.next,
    previous: store.previous,
  };
}
