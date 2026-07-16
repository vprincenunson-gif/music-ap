import { Song, SearchResult } from '@/types';
import { searchYouTube } from './youtube';

const SOUNDCLOUD_CLIENT_ID = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID || '';

// Search SoundCloud for tracks
export async function searchSoundCloud(query: string, limit = 20): Promise<SearchResult> {
  try {
    const response = await fetch(
      `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`
    );
    const data = await response.json();

    if (!data.collection) return { songs: [] };

    const songs = data.collection
      .filter((item: any) => item.streamable)
      .map((item: any) => ({
        id: `sc-${item.id}`,
        title: item.title,
        artist: item.user?.username || 'Unknown',
        coverUrl: item.artwork_url?.replace('large', 't500x500') || '',
        duration: Math.floor(item.duration / 1000), // ms to seconds
        source: 'soundcloud' as const,
        sourceId: item.id.toString(),
      }));

    return { songs };
  } catch (error) {
    console.error('SoundCloud search failed:', error);
    return { songs: [] };
  }
}

// Search both YouTube and SoundCloud
export async function searchAll(query: string): Promise<Song[]> {
  const [ytResults, scResults] = await Promise.all([
    searchYouTube(query),
    searchSoundCloud(query),
  ]);

  const allSongs = [...ytResults.songs, ...scResults.songs];
  // Shuffle results for variety
  return allSongs.sort(() => Math.random() - 0.5);
}

// Mock search for development (no API keys needed)
export async function searchMock(query: string): Promise<Song[]> {
  const mockSongs: Song[] = [
    {
      id: 'mock-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 200,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
    },
    {
      id: 'mock-2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838efb7a2b6e7c',
      duration: 234,
      source: 'youtube',
      sourceId: 'JGwWNGJdvx8',
    },
    {
      id: 'mock-3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70e1b3e7c0a7e7a0c',
      duration: 355,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
    },
    {
      id: 'mock-4',
      title: 'Hotel California',
      artist: 'Eagles',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a2f7c5e9b3c5a1b2d3e4f5',
      duration: 391,
      source: 'youtube',
      sourceId: 'BciS5krYL80',
    },
    {
      id: 'mock-5',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a2f7c5e9b3c5a1b2d3e4f5',
      duration: 482,
      source: 'youtube',
      sourceId: 'QkF3oxPcKi8',
    },
    {
      id: 'mock-6',
      title: 'Imagine',
      artist: 'John Lennon',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70e1b3e7c0a7e7a0c',
      duration: 187,
      source: 'youtube',
      sourceId: 'YkgkThdzX-8',
    },
    {
      id: 'mock-7',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a2f7c5e9b3c5a1b2d3e4f5',
      duration: 301,
      source: 'youtube',
      sourceId: 'hTWKbfoikeg',
    },
    {
      id: 'mock-8',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a2f7c5e9b3c5a1b2d3e4f5',
      duration: 294,
      source: 'youtube',
      sourceId: 'Zi_XLOBDo_Y',
    },
  ];
  return mockSongs;
}
