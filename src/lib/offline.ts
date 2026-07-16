import { openDB, IDBPDatabase } from 'idb';
import { Song, Playlist } from '@/types';

const DB_NAME = 'music-app-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('songs')) {
          db.createObjectStore('songs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('audioCache')) {
          db.createObjectStore('audioCache', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Save a song for offline playback
export async function cacheSongForOffline(song: Song, audioBlob: Blob): Promise<void> {
  const db = await getDb();
  await db.put('songs', song);
  await db.put('audioCache', { id: song.id, blob: audioBlob });
}

// Get a cached song
export async function getCachedSong(songId: string): Promise<Song | undefined> {
  const db = await getDb();
  return db.get('songs', songId);
}

// Get cached audio blob
export async function getCachedAudio(songId: string): Promise<Blob | undefined> {
  const db = await getDb();
  const entry = await db.get('audioCache', songId);
  return entry?.blob;
}

// Remove a cached song
export async function removeCachedSong(songId: string): Promise<void> {
  const db = await getDb();
  await db.delete('songs', songId);
  await db.delete('audioCache', songId);
}

// Get all cached songs
export async function getAllCachedSongs(): Promise<any[]> {
  const db = await getDb();
  return db.getAll('songs');
}

// Get cache size info
export async function getCacheInfo(): Promise<{ songs: number; size: string }> {
  const db = await getDb();
  const songs = await db.getAll('audioCache');
  const totalSize = songs.reduce((acc, s) => acc + (s.blob?.size || 0), 0);
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
  return { songs: songs.length, size: `${sizeMB} MB` };
}
