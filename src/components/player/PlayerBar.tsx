'use client';

import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { QueuePanel } from './QueuePanel';
import { EQControl } from './EQControl';
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
  SlidersHorizontal,
} from 'lucide-react';

export function PlayerBar() {
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

  const [showQueue, setShowQueue] = useState(false);
  const [showEq, setShowEq] = useState(false);

  if (!currentSong) {
    return (
      <div className="h-20 flex items-center justify-center bg-zinc-900 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">No song playing</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-72">
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

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-colors" title="Shuffle">
              <Shuffle size={16} />
            </button>
            <button onClick={playPrevious} className="text-zinc-400 hover:text-white transition-colors" title="Previous">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="text-zinc-400 hover:text-white transition-colors" title="Next">
              <SkipForward size={20} />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors" title="Repeat">
              <Repeat size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-zinc-500 w-10 text-right">{formatTime(progress)}</span>
            <Slider
              value={progress}
              max={duration || 100}
              onChange={seek}
              size="sm"
              className="flex-1"
            />
            <span className="text-xs text-zinc-500 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right side: volume + extras */}
        <div className="w-72 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowEq(!showEq)}
            className={`transition-colors ${showEq ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`}
            title="Equalizer"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`transition-colors ${showQueue ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`}
            title="Queue"
          >
            <List size={18} />
          </button>
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="w-24">
            <Slider
              value={isMuted ? 0 : volume * 100}
              max={100}
              onChange={(v) => setVolume(v / 100)}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Queue panel overlay */}
      {showQueue && (
        <div className="absolute bottom-20 right-4 w-80 max-h-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <QueuePanel onClose={() => setShowQueue(false)} />
        </div>
      )}

      {/* EQ panel overlay */}
      {showEq && (
        <div className="absolute bottom-20 right-4 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50">
          <EQControl onClose={() => setShowEq(false)} />
        </div>
      )}
    </>
  );
}
