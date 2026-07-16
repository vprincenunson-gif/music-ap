'use client';

import { useState, useEffect, useCallback } from 'react';
import { Song } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';
import { useQueue } from '@/hooks/useQueue';
import { searchMock } from '@/lib/soundcloud';
import { SongCard } from '@/components/library/SongCard';
import { Search, Loader2, X } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { playSong } = usePlayer();

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const songs = await searchMock(q);
      setResults(songs);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results */}
      {isSearching ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-indigo-400 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-zinc-400 mb-4">Found {results.length} results</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((song) => (
              <SongCard key={song.id} song={song} onPlay={playSong} />
            ))}
          </div>
        </div>
      ) : query && !isSearching ? (
        <div className="text-center py-20">
          <p className="text-zinc-500">No results found for "{query}"</p>
        </div>
      ) : !query ? (
        <div className="text-center py-20">
          <Search size={48} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">Search for your favorite songs</p>
        </div>
      ) : null}
    </div>
  );
}
