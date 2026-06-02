
export interface YouTubeMetadata {
  title: string;
  description: string;
  videoId: string;
  publishDate: string;
}

export interface ExtractedContent {
  title: string;
  type: 'series' | 'movie' | 'ova' | 'special' | 'trailer' | 'clip';
  season?: number;
  episode?: number;
}

export function extractMetadata(meta: YouTubeMetadata): ExtractedContent {
  const title = meta.title.toLowerCase();
  
  // Detection logic
  if (title.includes('trailer')) return { title: meta.title, type: 'trailer' };
  if (title.includes('movie')) return { title: meta.title, type: 'movie' };
  if (title.includes('ova')) return { title: meta.title, type: 'ova' };
  if (title.includes('special')) return { title: meta.title, type: 'special' };
  if (title.includes('clip')) return { title: meta.title, type: 'clip' };
  
  // Basic Series detection: "Title - Episode X"
  const episodeMatch = meta.title.match(/episode\s+(\d+)/i) || meta.title.match(/- (\d+)/);
  const seasonMatch = meta.title.match(/season\s+(\d+)/i) || meta.title.match(/s(\d+)/i);
  
  return {
    title: meta.title,
    type: 'series',
    season: seasonMatch ? parseInt(seasonMatch[1], 10) : 1,
    episode: episodeMatch ? parseInt(episodeMatch[1], 10) : undefined
  };
}
