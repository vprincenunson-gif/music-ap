'use client';

import { useQueue } from '@/hooks/useQueue';
import { usePlayer } from '@/hooks/usePlayer';
import { X, Trash2 } from 'lucide-react';

interface QueuePanelProps {
  onClose: () => void;
}

export function QueuePanel({ onClose }: QueuePanelProps) {
  const { queue, currentIndex, removeFromQueue, clearQueue } = useQueue();
  const { playSong } = usePlayer();

  let content;
  if (queue.length === 0) {
    content = <p className="text-zinc-500 text-sm text-center py-8">Queue is empty</p>;
  } else {
    content = queue.map((item, index) => (
      <div
        key={`${item.song.id}-${index}`}
        className={`flex items-center gap-3 p-2 hover:bg-zinc-800 transition-colors cursor-pointer ${index === currentIndex ? 'bg-zinc-800' : ''}`}
        onClick={() => playSong(item.song)}
      >
        <img src={item.song.coverUrl} alt={item.song.title} className="w-10 h-10 rounded object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate">{item.song.title}</p>
          <p className="text-xs text-zinc-400 truncate">{item.song.artist}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); removeFromQueue(index); }}
          className="text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ));
  }

  return (
    <div>
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-white">Queue</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearQueue} className="text-xs text-zinc-400 hover:text-white transition-colors">Clear</button>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-80">
        {content}
      </div>
    </div>
  );
}
