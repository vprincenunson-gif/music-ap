'use client';

import { useState } from 'react';
import { Song } from '@/types';
import { normalizeCoverUrl } from '@/lib/utils';
import { Play, Loader2 } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  showActions?: boolean;
}

const COLORS = ['#6366f1','#ec4899','#14b8a6','#f59e0b','#8b5cf6','#06b6d4','#10b981','#f43f5e'];

function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function SongCard({ song, onPlay }: SongCardProps) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const color = getColor(song.id);

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLoading(true);
    onPlay(song);
    // Reset loading after a moment (song will start playing)
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div
      className="group bg-zinc-800/40 hover:bg-zinc-800 rounded-xl p-3 transition-all cursor-pointer card-hover"
      onClick={() => handlePlay()}
    >
      <div className="relative mb-3">
        {imgError ? (
          <div
            className="w-full aspect-square rounded-lg flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: color }}
          >
            {song.title.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className={`w-full aspect-square rounded-lg overflow-hidden ${true ? '' : ''}`}>
            <img
              src={normalizeCoverUrl(song.coverUrl, song.title)}
              alt={song.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        )}
        <button
          className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105 hover:bg-indigo-400"
          onClick={handlePlay}
        >
          {loading ? (
            <Loader2 size={16} className="text-white animate-spin" />
          ) : (
            <Play size={18} className="text-white ml-0.5" />
          )}
        </button>
      </div>
      <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
      <p className="text-xs text-zinc-400 truncate mt-1">{song.artist}</p>
    </div>
  );
}