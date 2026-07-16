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
    {
      id: 'mock-9',
      title: 'Believer',
      artist: 'Imagine Dragons',
      coverUrl: getGradientCover('Believer', 0),
      duration: 204,
      source: 'youtube',
      sourceId: '7wtfhZwyrcc',
      streamUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    },
    {
      id: 'mock-10',
      title: 'Let It Be',
      artist: 'The Beatles',
      coverUrl: getGradientCover('Let It Be', 1),
      duration: 243,
      source: 'youtube',
      sourceId: 'QDYfEBYipNM',
      streamUrl: 'https://www.youtube.com/watch?v=QDYfEBYipNM',
    },
    {
      id: 'mock-11',
      title: 'Africa',
      artist: 'Toto',
      coverUrl: getGradientCover('Africa', 2),
      duration: 295,
      source: 'youtube',
      sourceId: 'FTQbiNvZqaY',
      streamUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    },
    {
      id: 'mock-12',
      title: 'Sweet Child O Mine',
      artist: 'Guns N Roses',
      coverUrl: getGradientCover('Sweet Child O Mine', 3),
      duration: 356,
      source: 'youtube',
      sourceId: '1w7OgIMMRc4',
      streamUrl: 'https://www.youtube.com/watch?v=1w7OgIMMRc4',
    },
    {
      id: 'mock-13',
      title: 'Yesterday',
      artist: 'The Beatles',
      coverUrl: getGradientCover('Yesterday', 4),
      duration: 125,
      source: 'youtube',
      sourceId: 'wXTJBrWCttc',
      streamUrl: 'https://www.youtube.com/watch?v=wXTJBrWCttc',
    },
    {
      id: 'mock-14',
      title: 'Believer',
      artist: 'Imagine Dragons',
      coverUrl: getGradientCover('Believer', 5),
      duration: 204,
      source: 'youtube',
      sourceId: '7wtfhZwyrcc',
      streamUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    },
    {
      id: 'mock-15',
      title: 'Let It Be',
      artist: 'The Beatles',
      coverUrl: getGradientCover('Let It Be', 6),
      duration: 243,
      source: 'youtube',
      sourceId: 'QDYfEBYipNM',
      streamUrl: 'https://www.youtube.com/watch?v=QDYfEBYipNM',
    },
    {
      id: 'mock-16',
      title: 'Africa',
      artist: 'Toto',
      coverUrl: getGradientCover('Africa', 7),
      duration: 295,
      source: 'youtube',
      sourceId: 'FTQbiNvZqaY',
      streamUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    },
    {
      id: 'mock-17',
      title: 'Dance Monkey',
      artist: 'Tones and I',
      coverUrl: getGradientCover('Dance Monkey', 0),
      duration: 209,
      source: 'youtube',
      sourceId: 'q0hyYWKXF0Q',
      streamUrl: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
    },
    {
      id: 'mock-18',
      title: 'Someone Like You',
      artist: 'Adele',
      coverUrl: getGradientCover('Someone Like You', 1),
      duration: 285,
      source: 'youtube',
      sourceId: 'hLQl3WQQoQ0',
      streamUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
    },
    {
      id: 'mock-19',
      title: 'Rolling in the Deep',
      artist: 'Adele',
      coverUrl: getGradientCover('Rolling in the Deep', 2),
      duration: 228,
      source: 'youtube',
      sourceId: 'rYEDA3JcQqw',
      streamUrl: 'https://www.youtube.com/watch?v=rYEDA3JcQqw',
    },
    {
      id: 'mock-20',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      coverUrl: getGradientCover('Uptown Funk', 3),
      duration: 270,
      source: 'youtube',
      sourceId: 'OPf0YbXqDm0',
      streamUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    },
    {
      id: 'mock-21',
      title: 'Happy',
      artist: 'Pharrell Williams',
      coverUrl: getGradientCover('Happy', 4),
      duration: 233,
      source: 'youtube',
      sourceId: 'ZbZSe6N_BXs',
      streamUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
    },
    {
      id: 'mock-22',
      title: 'Counting Stars',
      artist: 'OneRepublic',
      coverUrl: getGradientCover('Counting Stars', 5),
      duration: 257,
      source: 'youtube',
      sourceId: 'hT_nvWreIhg',
      streamUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
    },
    {
      id: 'mock-23',
      title: 'Lean On',
      artist: 'Major Lazer ft. DJ Snake',
      coverUrl: getGradientCover('Lean On', 6),
      duration: 176,
      source: 'youtube',
      sourceId: 'YqeW9_5kURI',
      streamUrl: 'https://www.youtube.com/watch?v=YqeW9_5kURI',
    },
    {
      id: 'mock-24',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      coverUrl: getGradientCover('Sunflower', 7),
      duration: 158,
      source: 'youtube',
      sourceId: 'ApXoWvfEYVU',
      streamUrl: 'https://www.youtube.com/watch?v=ApXoWvfEYVU',
    },
    {
      id: 'mock-25',
      title: 'Lose Yourself',
      artist: 'Eminem',
      coverUrl: getGradientCover('Lose Yourself', 0),
      duration: 326,
      source: 'youtube',
      sourceId: '_Yhyp-_hX2s',
      streamUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s',
    },
    {
      id: 'mock-26',
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      coverUrl: getGradientCover('Despacito', 1),
      duration: 228,
      source: 'youtube',
      sourceId: 'kJQP7kiw5Fk',
      streamUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    },
    {
      id: 'mock-27',
      title: 'See You Again',
      artist: 'Wiz Khalifa ft. Charlie Puth',
      coverUrl: getGradientCover('See You Again', 2),
      duration: 237,
      source: 'youtube',
      sourceId: 'RgKAFK5djSk',
      streamUrl: 'https://www.youtube.com/watch?v=RgKAFK5djSk',
    },
    {
      id: 'mock-28',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      coverUrl: getGradientCover('Perfect', 3),
      duration: 263,
      source: 'youtube',
      sourceId: '2Vv-BfVoq4g',
      streamUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    },
    {
      id: 'mock-29',
      title: 'Thunder',
      artist: 'Imagine Dragons',
      coverUrl: getGradientCover('Thunder', 4),
      duration: 187,
      source: 'youtube',
      sourceId: 'fKopy74weus',
      streamUrl: 'https://www.youtube.com/watch?v=fKopy74weus',
    },
    {
      id: 'mock-30',
      title: 'Havana',
      artist: 'Camila Cabello',
      coverUrl: getGradientCover('Havana', 5),
      duration: 217,
      source: 'youtube',
      sourceId: 'BQ0mxQXmLsk',
      streamUrl: 'https://www.youtube.com/watch?v=BQ0mxQXmLsk',
    },
  ];
  return mockSongs;
}