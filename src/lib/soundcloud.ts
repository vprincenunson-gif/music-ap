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

// Generate a unique image URL per song using picsum.photos with a deterministic seed
function getAlbumCover(title: string): string {
  const seed = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://picsum.photos/seed/${seed}/400/400`;
}

// Mock search — uses picsum.photos for consistent images, YouTube IDs for audio
export async function searchMock(query: string): Promise<Song[]> {
  const mockSongs: Song[] = [
    {
      id: 'mock-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      coverUrl: getAlbumCover('Blinding Lights'),
      duration: 200,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
      streamUrl: 'https://www.youtube.com/watch?v=fJ9rZzT0Z2g',
    },
    {
      id: 'mock-2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      coverUrl: getAlbumCover('Shape of You'),
      duration: 234,
      source: 'youtube',
      sourceId: 'JGwWNGJdvx8',
      streamUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    },
    {
      id: 'mock-3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      coverUrl: getAlbumCover('Bohemian Rhapsody'),
      duration: 355,
      source: 'youtube',
      sourceId: 'fJ9rZzT0Z2g',
      streamUrl: 'https://www.youtube.com/watch?v=fJ9rZzT0Z2g',
    },
    {
      id: 'mock-4',
      title: 'Hotel California',
      artist: 'Eagles',
      coverUrl: getAlbumCover('Hotel California'),
      duration: 391,
      source: 'youtube',
      sourceId: 'BciS5krYL80',
      streamUrl: 'https://www.youtube.com/watch?v=BciS5krYL80',
    },
    {
      id: 'mock-5',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      coverUrl: getAlbumCover('Stairway to Heaven'),
      duration: 482,
      source: 'youtube',
      sourceId: 'QkF3oxPcKi8',
      streamUrl: 'https://www.youtube.com/watch?v=QkF3oxPcKi8',
    },
    {
      id: 'mock-6',
      title: 'Imagine',
      artist: 'John Lennon',
      coverUrl: getAlbumCover('Imagine'),
      duration: 187,
      source: 'youtube',
      sourceId: 'YkgkThdzX-8',
      streamUrl: 'https://www.youtube.com/watch?v=YkgkThdzX-8',
    },
    {
      id: 'mock-7',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      coverUrl: getAlbumCover('Smells Like Teen Spirit'),
      duration: 301,
      source: 'youtube',
      sourceId: 'hTWKbfoikeg',
      streamUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
    },
    {
      id: 'mock-8',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      coverUrl: getAlbumCover('Billie Jean'),
      duration: 294,
      source: 'youtube',
      sourceId: 'Zi_XLOBDo_Y',
      streamUrl: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
    },
    {
      id: 'mock-9',
      title: 'Believer',
      artist: 'Imagine Dragons',
      coverUrl: getAlbumCover('Believer'),
      duration: 204,
      source: 'youtube',
      sourceId: '7wtfhZwyrcc',
      streamUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    },
    {
      id: 'mock-10',
      title: 'Let It Be',
      artist: 'The Beatles',
      coverUrl: getAlbumCover('Let It Be'),
      duration: 243,
      source: 'youtube',
      sourceId: 'QDYfEBYipNM',
      streamUrl: 'https://www.youtube.com/watch?v=QDYfEBYipNM',
    },
    {
      id: 'mock-11',
      title: 'Africa',
      artist: 'Toto',
      coverUrl: getAlbumCover('Africa'),
      duration: 295,
      source: 'youtube',
      sourceId: 'FTQbiNvZqaY',
      streamUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    },
    {
      id: 'mock-12',
      title: 'Sweet Child O Mine',
      artist: 'Guns N Roses',
      coverUrl: getAlbumCover('Sweet Child O Mine'),
      duration: 356,
      source: 'youtube',
      sourceId: '1w7OgIMMRc4',
      streamUrl: 'https://www.youtube.com/watch?v=1w7OgIMMRc4',
    },
    {
      id: 'mock-13',
      title: 'Yesterday',
      artist: 'The Beatles',
      coverUrl: getAlbumCover('Yesterday'),
      duration: 125,
      source: 'youtube',
      sourceId: 'wXTJBrWCttc',
      streamUrl: 'https://www.youtube.com/watch?v=wXTJBrWCttc',
    },
    {
      id: 'mock-14',
      title: 'Believer',
      artist: 'Imagine Dragons',
      coverUrl: getAlbumCover('Believer'),
      duration: 204,
      source: 'youtube',
      sourceId: '7wtfhZwyrcc',
      streamUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    },
    {
      id: 'mock-15',
      title: 'Let It Be',
      artist: 'The Beatles',
      coverUrl: getAlbumCover('Let It Be'),
      duration: 243,
      source: 'youtube',
      sourceId: 'QDYfEBYipNM',
      streamUrl: 'https://www.youtube.com/watch?v=QDYfEBYipNM',
    },
    {
      id: 'mock-16',
      title: 'Africa',
      artist: 'Toto',
      coverUrl: getAlbumCover('Africa'),
      duration: 295,
      source: 'youtube',
      sourceId: 'FTQbiNvZqaY',
      streamUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    },
    {
      id: 'mock-17',
      title: 'Dance Monkey',
      artist: 'Tones and I',
      coverUrl: getAlbumCover('Dance Monkey'),
      duration: 209,
      source: 'youtube',
      sourceId: 'q0hyYWKXF0Q',
      streamUrl: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
    },
    {
      id: 'mock-18',
      title: 'Someone Like You',
      artist: 'Adele',
      coverUrl: getAlbumCover('Someone Like You'),
      duration: 285,
      source: 'youtube',
      sourceId: 'hLQl3WQQoQ0',
      streamUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
    },
    {
      id: 'mock-19',
      title: 'Rolling in the Deep',
      artist: 'Adele',
      coverUrl: getAlbumCover('Rolling in the Deep'),
      duration: 228,
      source: 'youtube',
      sourceId: 'rYEDA3JcQqw',
      streamUrl: 'https://www.youtube.com/watch?v=rYEDA3JcQqw',
    },
    {
      id: 'mock-20',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      coverUrl: getAlbumCover('Uptown Funk'),
      duration: 270,
      source: 'youtube',
      sourceId: 'OPf0YbXqDm0',
      streamUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    },
    {
      id: 'mock-21',
      title: 'Happy',
      artist: 'Pharrell Williams',
      coverUrl: getAlbumCover('Happy'),
      duration: 233,
      source: 'youtube',
      sourceId: 'ZbZSe6N_BXs',
      streamUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
    },
    {
      id: 'mock-22',
      title: 'Counting Stars',
      artist: 'OneRepublic',
      coverUrl: getAlbumCover('Counting Stars'),
      duration: 257,
      source: 'youtube',
      sourceId: 'hT_nvWreIhg',
      streamUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
    },
    {
      id: 'mock-23',
      title: 'Lean On',
      artist: 'Major Lazer ft. DJ Snake',
      coverUrl: getAlbumCover('Lean On'),
      duration: 176,
      source: 'youtube',
      sourceId: 'YqeW9_5kURI',
      streamUrl: 'https://www.youtube.com/watch?v=YqeW9_5kURI',
    },
    {
      id: 'mock-24',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      coverUrl: getAlbumCover('Sunflower'),
      duration: 158,
      source: 'youtube',
      sourceId: 'ApXoWvfEYVU',
      streamUrl: 'https://www.youtube.com/watch?v=ApXoWvfEYVU',
    },
    {
      id: 'mock-25',
      title: 'Lose Yourself',
      artist: 'Eminem',
      coverUrl: getAlbumCover('Lose Yourself'),
      duration: 326,
      source: 'youtube',
      sourceId: '_Yhyp-_hX2s',
      streamUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s',
    },
    {
      id: 'mock-26',
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      coverUrl: getAlbumCover('Despacito'),
      duration: 228,
      source: 'youtube',
      sourceId: 'kJQP7kiw5Fk',
      streamUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    },
    {
      id: 'mock-27',
      title: 'See You Again',
      artist: 'Wiz Khalifa ft. Charlie Puth',
      coverUrl: getAlbumCover('See You Again'),
      duration: 237,
      source: 'youtube',
      sourceId: 'RgKAFK5djSk',
      streamUrl: 'https://www.youtube.com/watch?v=RgKAFK5djSk',
    },
    {
      id: 'mock-28',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      coverUrl: getAlbumCover('Perfect'),
      duration: 263,
      source: 'youtube',
      sourceId: '2Vv-BfVoq4g',
      streamUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    },
    {
      id: 'mock-29',
      title: 'Thunder',
      artist: 'Imagine Dragons',
      coverUrl: getAlbumCover('Thunder'),
      duration: 187,
      source: 'youtube',
      sourceId: 'fKopy74weus',
      streamUrl: 'https://www.youtube.com/watch?v=fKopy74weus',
    },
    {
      id: 'mock-30',
      title: 'Havana',
      artist: 'Camila Cabello',
      coverUrl: getAlbumCover('Havana'),
      duration: 217,
      source: 'youtube',
      sourceId: 'BQ0mxQXmLsk',
      streamUrl: 'https://www.youtube.com/watch?v=BQ0mxQXmLsk',
    },
  ];
  return mockSongs;
}