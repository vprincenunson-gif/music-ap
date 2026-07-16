// Song / Track types
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: number; // seconds
  source: 'youtube' | 'soundcloud';
  sourceId: string; // YouTube video ID or SoundCloud track ID
  streamUrl?: string;
  lyrics?: string;
}

export interface QueueItem {
  song: Song;
  addedAt: number;
  requestedBy?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Song[];
  createdAt: number;
  updatedAt: number;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  eqSettings: EQSettings;
}

export interface EQSettings {
  bass: number;    // -10 to 10
  mid: number;     // -10 to 10
  treble: number;  // -10 to 10
}

export interface JamSession {
  id: string;
  host: string;
  participants: string[];
  currentSong: Song | null;
  isActive: boolean;
}

export interface SearchResult {
  songs: Song[];
  nextPageToken?: string;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  icon: string;
}
