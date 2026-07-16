'use client';

import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { useLibraryStore } from '@/stores/libraryStore';
import { SongCard } from '@/components/library/SongCard';
import { Play, Heart, FolderPlus, Music } from 'lucide-react';

export default function LibraryPage() {
  const { savedSongs, playlists, createPlaylist, deletePlaylist } = useLibraryStore();
  const { playSong } = usePlayer();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName.trim());
      setPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Your Library</h1>

      {/* Saved songs */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Saved Songs</h2>
        {savedSongs.length === 0 ? (
          <p className="text-zinc-500 text-sm">No saved songs yet. Save songs from search results!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {savedSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={playSong} />
            ))}
          </div>
        )}
      </section>

      {/* Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Playlists</h2>
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            + New Playlist
          </button>
        </div>
        {playlists.length === 0 ? (
          <p className="text-zinc-500 text-sm">No playlists yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-zinc-800/40 rounded-xl p-4 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                  <Music size={32} className="text-white/60" />
                </div>
                <h3 className="text-sm font-medium text-white truncate">{playlist.name}</h3>
                <p className="text-xs text-zinc-400">{playlist.songs.length} songs</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}