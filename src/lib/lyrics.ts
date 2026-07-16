// Lyrics fetching from multiple free sources

interface LyricsResponse {
  lyrics: string;
  source: string;
}

// Fetch lyrics from lyrics.ovh (free, no API key needed)
export async function fetchLyrics(artist: string, title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.lyrics || null;
  } catch (error) {
    console.error('Failed to fetch lyrics:', error);
    return null;
  }
}

// Parse lyrics into lines with timestamps (for synchronized display)
export interface LyricLine {
  time: number; // seconds
  text: string;
}

// Simple line-by-line parsing (no timestamps from free APIs)
export function parseLyrics(lyrics: string): LyricLine[] {
  return lyrics
    .split('\n')
    .filter((line) => line.trim())
    .map((line, index) => ({
      time: index * 5, // Approximate: each line ~5 seconds apart
      text: line.trim(),
    }));
}
