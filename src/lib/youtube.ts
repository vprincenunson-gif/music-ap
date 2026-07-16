import { Song, SearchResult } from '@/types';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Search YouTube for songs
export async function searchYouTube(query: string, maxResults = 20): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (!data.items) return { songs: [] };

    const songs = data.items.map((item: any) => ({
      id: `yt-${item.id.videoId}`,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      coverUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      duration: 0, // Will be fetched separately
      source: 'youtube' as const,
      sourceId: item.id.videoId,
    }));

    return {
      songs,
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('YouTube search failed:', error);
    return { songs: [] };
  }
}

// Get video details including duration
export async function getYouTubeVideoDetails(videoId: string): Promise<{ duration: number; title: string; channelTitle: string } | null> {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=contentDetails,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    if (!data.items?.[0]) return null;

    const item = data.items[0];
    // Convert ISO 8601 duration to seconds
    const durationStr = item.contentDetails.duration;
    const match = durationStr.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');
    const duration = hours * 3600 + minutes * 60 + seconds;

    return {
      duration,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
    };
  } catch (error) {
    console.error('Failed to get video details:', error);
    return null;
  }
}

// Get streaming URL via our API route (server-side proxy)
export async function getYouTubeStreamUrl(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/youtube/stream?videoId=${videoId}`);
    const data = await response.json();
    return data.streamUrl || null;
  } catch (error) {
    console.error('Failed to get stream URL:', error);
    return null;
  }
}
