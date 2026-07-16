'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { Slider } from '@/components/ui/Slider';
import { formatTime } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  List,
} from 'lucide-react';

interface PlayerControlsProps {
  onToggleQueue: () => void;
}

export function PlayerControls({ onToggleQueue }: PlayerControlsProps) {
  const {
    isPlaying,
    currentSong,
    progress,
    duration,
    volume,
    isMuted,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Song info */}
      <div className="flex items-center gap-3 px-4">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentSong.title}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mt-2">
        <Slider
          value={progress}
          max={duration || 100}
          onChange={seek}
          size="sm"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 px-4 mt-2">
        <button onClick={playPrevious} className="text-zinc-400 hover:text-white transition-colors" title="Previous">
          <SkipBack size={20} />
        </button>
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <button onClick={playNext} className="text-zinc-400 hover:text-white transition-colors" title="Next">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
