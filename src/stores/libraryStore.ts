'use client';

import { create } from 'zustand';
import { Song, Playlist } from '@/types';

interface LibraryStore {
  savedSongs: Song[];
  playlists: Playlist[];
  recentSongs: Song[];

  saveSong: (song: Song) => void;
  removeSong: (songId: string) => void;
  isSongSaved: (songId: string) => boolean;
  addToRecent: (song: Song) => void;
  createPlaylist: (name: string, description?: string) => string;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylist: (playlistId: string) => Playlist | undefined;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  savedSongs: [],
  playlists: [],
  recentSongs: [],

  saveSong: (song) =>
    set((s) => {
      if (s.savedSongs.find((s) => s.id === song.id)) return s;
      return { savedSongs: [...s.savedSongs, song] };
    }),

  removeSong: (songId) =>
    set((s) => ({
      savedSongs: s.savedSongs.filter((s) => s.id !== songId),
    })),

  isSongSaved: (songId) => get().savedSongs.some((s) => s.id === songId),

  addToRecent: (song) =>
    set((s) => ({
      recentSongs: [
        song,
        ...s.recentSongs.filter((rs) => rs.id !== song.id),
      ].slice(0, 50),
    })),

  createPlaylist: (name, description) => {
    const id = `playlist-${Date.now()}`;
    set((s) => ({
      playlists: [
        ...s.playlists,
        {
          id,
          name,
          description,
          songs: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    }));
    return id;
  },

  deletePlaylist: (playlistId) =>
    set((s) => ({
      playlists: s.playlists.filter((p) => p.id !== playlistId),
    })),

  addSongToPlaylist: (playlistId, song) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              songs: p.songs.find((s) => s.id === song.id)
                ? p.songs
                : [...p.songs, song],
              updatedAt: Date.now(),
            }
          : p
      ),
    })),

  removeSongFromPlaylist: (playlistId, songId) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              songs: p.songs.filter((s) => s.id !== songId),
              updatedAt: Date.now(),
            }
          : p
      ),
    })),

  getPlaylist: (playlistId) => get().playlists.find((p) => p.id === playlistId),
}));
