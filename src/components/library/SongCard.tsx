'use client';

import { Song } from '@/types';
import { useQueue } from '@/hooks/useQueue';
import { useLibraryStore } from '@/stores/libraryStore';
import { Play, Heart, Plus } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  showActions?: boolean;
}

export function SongCard({ song, onPlay, showActions = true }: SongCardProps) {
  const { addToQueue } = useQueue();
  const { saveSong, isSongSaved, removeSong } = useLibraryStore();
  const saved = isSongSaved(song.id);

  return (
    <div
      className="group bg-zinc-800/40 hover:bg-zinc-800 rounded-xl p-3 transition-all cursor-pointer"
      onClick={() => onPlay(song)}
    >
      <div className="relative mb-3">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <button
          className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105 hover:bg-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(song);
          }}
        >
          <Play size={18} className="text-white ml-0.5" />
        </button>
      </div>
      <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
      <p className="text-xs text-zinc-400 truncate mt-1">{song.artist}</p>
    </div>
  );
}
