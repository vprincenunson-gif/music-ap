'use client';

import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { QueuePanel } from './QueuePanel';
import { EQControl } from './EQControl';
import { Slider } from '@/components/ui/Slider';
import { formatTime, normalizeCoverUrl } from '@/lib/utils';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX, List, SlidersHorizontal,
} from 'lucide-react';

const COLORS = ['#6366f1','#ec4899','#14b8a6','#f59e0b','#8b5cf6','#06b6d4','#10b981','#f43f5e'];
function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function PlayerBar() {
  const {
    isPlaying, currentSong, progress, duration, volume, isMuted,
    togglePlay, playNext, playPrevious, seek, setVolume, toggleMute,
  } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!currentSong) {
    return (
      <div className="h-20 flex items-center justify-center bg-zinc-900 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">No song playing</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop player bar */}
      <div className="hidden md:flex h-20 bg-zinc-900 border-t border-zinc-800 items-center px-4 gap-4">
        {/* Song info with spinning album art */}
        <div className="flex items-center gap-3 w-72">
          <div className="relative shrink-0">
            {imgError ? (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: getColor(currentSong.id) }}
              >
                {currentSong.title.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''} shrink-0 ring-2 ring-indigo-500/30`}>
                <img
                  src={normalizeCoverUrl(currentSong.coverUrl, currentSong.title)}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
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
            <span className="text-sm text-zinc-400 w-12 text-right font-mono">{formatTime(progress)}</span>
            <Slider value={progress} max={duration || 100} onChange={seek} size="sm" className="flex-1" />
            <span className="text-sm text-zinc-400 w-12 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="w-72 flex items-center justify-end gap-2">
          <button onClick={() => setShowEq(!showEq)} className={`transition-colors ${showEq ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`} title="Equalizer">
            <SlidersHorizontal size={18} />
          </button>
          <button onClick={() => setShowQueue(!showQueue)} className={`transition-colors ${showQueue ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`} title="Queue">
            <List size={18} />
          </button>
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors" title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="w-24">
            <Slider value={isMuted ? 0 : volume * 100} max={100} onChange={(v) => setVolume(v / 100)} size="sm" />
          </div>
        </div>
      </div>

      {/* Mobile mini player - shown when a song is playing */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-3">
          {imgError ? (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: getColor(currentSong.id) }}>
              {currentSong.title.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''} shrink-0 ring-1 ring-indigo-500/30`}>
              <img src={normalizeCoverUrl(currentSong.coverUrl, currentSong.title)} alt={currentSong.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full">
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Hidden YouTube player container */}
      <div id="youtube-player" className="hidden" />

      {showQueue && (
        <div className="absolute bottom-20 right-4 w-80 max-h-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <QueuePanel onClose={() => setShowQueue(false)} />
        </div>
      )}
      {showEq && (
        <div className="absolute bottom-20 right-4 w-72 bg-zinc-900 border border-zinc-800 rounded-xl p-4 z-50">
          <EQControl onClose={() => setShowEq(false)} />
        </div>
      )}
    </>
  );
}