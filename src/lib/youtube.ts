import { Song, SearchResult } from '@/types';
import { normalizeCoverUrl } from './utils';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// --------------- Search ---------------
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
      coverUrl: normalizeCoverUrl(item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url),
      duration: 0,
      source: 'youtube' as const,
      sourceId: item.id.videoId,
      streamUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
    return { songs, nextPageToken: data.nextPageToken };
  } catch (error) {
    console.error('YouTube search failed:', error);
    return { songs: [] };
  }
}

// --------------- IFrame API Loader ---------------
let apiLoadPromise: Promise<void> | null = null;

export function loadYouTubeAPI(): Promise<void> {
  if ((window as any).YT?.loaded) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existing) {
      (window as any).onYouTubeIframeAPIReady = () => resolve();
      return;
    }
    (window as any).onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return apiLoadPromise;
}

// --------------- Player Singleton ---------------
let playerInstance: any = null;
let playerReady = false;
let pendingVideoId: string | null = null;
let onReadyCallbacks: Array<() => void> = [];
let onStateChangeCallback: ((state: number) => void) | null = null;
let onErrorCallback: ((error: any) => void) | null = null;

function getOrCreatePlayer(videoId: string): Promise<void> {
  return new Promise((resolve) => {
    if (playerInstance && playerReady) {
      playerInstance.loadVideoById(videoId);
      resolve();
      return;
    }

    // Player doesn't exist or isn't ready yet
    pendingVideoId = videoId;
    onReadyCallbacks.push(() => resolve());

    if (!playerInstance) {
      const container = document.getElementById('youtube-player');
      if (!container) {
        const div = document.createElement('div');
        div.id = 'youtube-player';
        div.style.position = 'absolute';
        div.style.width = '0';
        div.style.height = '0';
        div.style.overflow = 'hidden';
        document.body.appendChild(div);
      }
      playerInstance = new (window as any).YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: pendingVideoId || videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            playerReady = true;
            onReadyCallbacks.forEach((cb) => cb());
            onReadyCallbacks = [];
          },
          onStateChange: (event: any) => {
            if (onStateChangeCallback) onStateChangeCallback(event.data);
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            if (onErrorCallback) onErrorCallback(event);
          },
        },
      });
    }
  });
}

// --------------- Public API ---------------
let _progressCallback: ((time: number) => void) | null = null;
let _endedCallback: (() => void) | null = null;

export async function playVideo(videoId: string, callbacks?: {
  onProgress?: (time: number) => void;
  onEnded?: () => void;
  onError?: (err: any) => void;
}): Promise<void> {
  if (callbacks?.onProgress) _progressCallback = callbacks.onProgress;
  if (callbacks?.onEnded) _endedCallback = callbacks.onEnded;

  await loadYouTubeAPI();
  await getOrCreatePlayer(videoId);

  if (playerInstance?.playVideo) {
    playerInstance.playVideo();
  }
}

export function pauseVideo(): void {
  if (playerInstance?.pauseVideo) {
    playerInstance.pauseVideo();
  }
}

export function seekVideo(time: number): void {
  if (playerInstance?.seekTo) {
    playerInstance.seekTo(time, true);
  }
}

export function setVolume(vol: number): void {
  if (playerInstance?.setVolume) {
    playerInstance.setVolume(Math.max(0, Math.min(100, vol * 100)));
  }
}

export function getCurrentTime(): number {
  try { return playerInstance?.getCurrentTime?.() || 0; } catch { return 0; }
}

export function getDuration(): number {
  try { return playerInstance?.getDuration?.() || 0; } catch { return 0; }
}

export function destroyPlayer(): void {
  if (playerInstance?.destroy) {
    playerInstance.destroy();
  }
  playerInstance = null;
  playerReady = false;
  pendingVideoId = null;
  const el = document.getElementById('youtube-player');
  if (el) el.remove();
}
