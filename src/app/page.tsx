'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Song, Genre } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';
import { useQueue } from '@/hooks/useQueue';
import { useLibraryStore } from '@/stores/libraryStore';
import { searchMock } from '@/lib/soundcloud';
import { SongCard } from '@/components/library/SongCard';
import { TrendingUp, Clock, Music } from 'lucide-react';

const genres: Genre[] = [
  { id: 'pop', name: 'Pop', color: 'from-pink-500 to-rose-500', icon: '🎤' },
  { id: 'rock', name: 'Rock', color: 'from-red-500 to-orange-500', icon: '🎸' },
  { id: 'hiphop', name: 'Hip Hop', color: 'from-yellow-500 to-orange-500', icon: '🎧' },
  { id: 'electronic', name: 'Electronic', color: 'from-cyan-500 to-blue-500', icon: '🎹' },
  { id: 'jazz', name: 'Jazz', color: 'from-purple-500 to-pink-500', icon: '🎷' },
  { id: 'classical', name: 'Classical', color: 'from-emerald-500 to-teal-500', icon: '🎻' },
];

export default function HomePage() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState<string | null>(null);
  const { playSong } = usePlayer();
  const recent = useLibraryStore((s) => s.recentSongs);
  const router = useRouter();

  useEffect(() => {
    // Try file-based API first, fallback to localStorage
    fetch('/api/user')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.name);
        } else {
          // Fallback: check localStorage
          const saved = localStorage.getItem('muse-user');
          if (saved) {
            try { setUserName(JSON.parse(saved).name); } catch { router.push('/login'); }
          } else {
            router.push('/login');
          }
        }
      })
      .catch(() => {
        // API failed (Vercel) → check localStorage
        const saved = localStorage.getItem('muse-user');
        if (saved) {
          try { setUserName(JSON.parse(saved).name); } catch { router.push('/login'); }
        } else {
          router.push('/login');
        }
      });

    searchMock('trending music').then((songs) => {
      setTrendingSongs(songs);
      setTimeout(() => setVisible(true), 100);
    });
  }, [router]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting based on time of day
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Format time nicely
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="p-6 pb-24 page-enter">
      {/* Hero section with live clock & personalized greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting}, <span className="text-indigo-400">{userName || 'there'}</span>
        </h1>
        <p className="text-4xl font-bold text-indigo-400 font-mono tracking-wider">
          {timeStr}
        </p>
      </div>

      {/* Trending */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-400" />
          Trending Now
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingSongs.map((song, i) => (
            <div key={song.id} style={{ animationDelay: `${i * 0.05}s` }} className={`${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <SongCard song={song} onPlay={playSong} />
            </div>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Music size={20} className="text-indigo-400" />
          Browse by Genre
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {genres.map((genre, i) => (
            <div
              key={genre.id}
              style={{ animationDelay: `${i * 0.08}s` }}
              className={`bg-gradient-to-br ${genre.color} p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <span className="text-2xl">{genre.icon}</span>
              <p className="text-white font-medium text-sm mt-2">{genre.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent played */}
      {recent.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-indigo-400" />
            Recently Played
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recent.map((song, i) => (
              <div key={song.id} style={{ animationDelay: `${i * 0.05}s` }} className={`${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <SongCard key={song.id} song={song} onPlay={playSong} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
