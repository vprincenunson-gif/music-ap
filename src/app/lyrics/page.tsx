'use client';

import { useState, useEffect } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { fetchLyrics, parseLyrics, LyricLine } from '@/lib/lyrics';
import { Mic2, Loader2 } from 'lucide-react';

export default function LyricsPage() {
  const { currentSong, progress } = usePlayer();
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState(-1);

  useEffect(() => {
    if (!currentSong) return;
    setIsLoading(true);
    setError(null);
    fetchLyrics(currentSong.artist, currentSong.title)
      .then((lyrics) => {
        if (lyrics) {
          setLyrics(parseLyrics(lyrics));
        } else {
          setLyrics([]);
          setError('Lyrics not found');
        }
      })
      .catch(() => {
        setError('Failed to load lyrics');
      })
      .finally(() => setIsLoading(false));
  }, [currentSong]);

  // Highlight current line based on progress
  useEffect(() => {
    if (lyrics.length === 0) return;
    const currentLine = lyrics.findIndex(
      (line, i) =>
        progress >= line.time &&
        (i === lyrics.length - 1 || progress < lyrics[i + 1].time)
    );
    setActiveLine(currentLine);
  }, [progress, lyrics]);

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Lyrics</h1>

      {!currentSong ? (
        <div className="text-center py-20">
          <Mic2 size={48} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">Play a song to see its lyrics</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-indigo-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-zinc-500">{error}</p>
        </div>
      ) : lyrics.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500">No lyrics found for this song</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white">{currentSong?.title}</h2>
            <p className="text-zinc-400">{currentSong?.artist}</p>
          </div>
          <div className="space-y-4">
            {lyrics.map((line, index) => (
              <p
                key={index}
                className={`text-lg transition-all duration-300 ${
                  index === activeLine
                    ? 'text-white font-medium'
                    : 'text-zinc-500'
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}