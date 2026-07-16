import { Song, SearchResult } from '@/types';
import { searchYouTube } from './youtube';
import { normalizeCoverUrl } from './utils';

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
        coverUrl: normalizeCoverUrl(item.artwork_url?.replace('large', 't500x500')) || `https://picsum.photos/seed/${item.id}/300/300`,
        duration: Math.floor(item.duration / 1000),
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
  return allSongs.sort(() => Math.random() - 0.5);
}

// Generate a gradient-based cover with initials
function getGradientCover(title: string, index: number): string {
  const gradients = [
    '6366f1,8b5cf6',
    'ec4899,f43f5e',
    '14b8a6,06b6d4',
    'f59e0b,ef4444',
    '8b5cf6,ec4899',
    '06b6d4,3b82f6',
    '10b981,14b8a6',
    'f43f5e,f97316',
  ];
  const g = gradients[index % gradients.length];
  return `https://placehold.co/400x400/${g.split(',')[0]}/${g.split(',')[1]}?text=${encodeURIComponent(title.charAt(0))}`;
}

// Mock search — uses placehold.co for reliable images, YouTube IDs for audio
export async function searchMock(query: string): Promise<Song[]> {
  const mockSongs: Song[] = [
    {
      id: 'mock-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      coverUrl: getGradientCover('Blinding Lights', 0),
      duration: 200,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
      streamUrl: 'https://www.youtube.com/watch?v=fJ9rZzT0Z2g',
    },
    {
      id: 'mock-2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      coverUrl: getGradientCover('Shape of You', 1),
      duration: 234,
      source: 'youtube',
      sourceId: 'JGwWNGJdvx8',
      streamUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    },
    {
      id: 'mock-3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      coverUrl: getGradientCover('Bohemian Rhapsody', 2),
      duration: 355,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
      streamUrl: 'https://www.youtube.com/watch?v=fJ9rZzT0Z2g',
    },
    {
      id: 'mock-4',
      title: 'Hotel California',
      artist: 'Eagles',
      coverUrl: getGradientCover('Hotel California', 3),
      duration: 391,
      source: 'youtube',
      sourceId: 'BciS5krYL80',
      streamUrl: 'https://www.youtube.com/watch?v=BciS5krYL80',
    },
    {
      id: 'mock-5',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      coverUrl: getGradientCover('Stairway to Heaven', 4),
      duration: 482,
      source: 'youtube',
      sourceId: 'QkF3oxPcKi8',
      streamUrl: 'https://www.youtube.com/watch?v=QkF3oxPcKi8',
    },
    {
      id: 'mock-6',
      title: 'Imagine',
      artist: 'John Lennon',
      coverUrl: getGradientCover('Imagine', 5),
      duration: 187,
      source: 'youtube',
      sourceId: 'YkgkThdzX-8',
      streamUrl: 'https://www.youtube.com/watch?v=YkgkThdzX-8',
    },
    {
      id: 'mock-7',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      coverUrl: getGradientCover('Smells Like Teen Spirit', 6),
      duration: 301,
      source: 'youtube',
      sourceId: 'hTWKbfoikeg',
      streamUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
    },
    {
      id: 'mock-8',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      coverUrl: getGradientCover('Billie Jean', 7),
      duration: 294,
      source: 'youtube',
      sourceId: 'Zi_XLOBDo_Y',
      streamUrl: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
    },
  ];
  return mockSongs;
}
