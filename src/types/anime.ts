// ─── Raw API Shapes ─────────────────────────────────────────────────────────

export interface RawGenre {
  title: string;
  genreId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface RawEpisode {
  title: string;
  eps: number;
  date?: string;
  episodeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface RawAnimeListItem {
  title: string;
  poster: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
  episodes?: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  lastReleaseDate?: string;
  score?: string;
  status?: string;
  genreList?: RawGenre[];
  slug?: string;
}

export interface RawAnimeDetail {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | null;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: null;
  synopsis?: { paragraphs?: string[]; connections?: unknown[] } | string;
  genreList?: RawGenre[];
  episodeList?: RawEpisode[];
  recommendedAnimeList?: RawAnimeListItem[];
}

export interface RawScheduleItem {
  title: string;
  slug: string;
  url?: string;
  poster: string;
}

export interface RawScheduleDay {
  day: string;
  anime_list: RawScheduleItem[];
}

// Real structure from /anime/episode/:slug
export interface RawServerItem {
  title: string;       // server name e.g. "vidhide", "filedon"
  serverId: string;    // e.g. "6E9776-5-8B5u"
  href?: string;
}

export interface RawQualityGroup {
  title: string;       // e.g. "360p", "480p", "720p"
  serverList: RawServerItem[];
}

export interface RawDownloadUrl {
  title: string;       // e.g. "Mp4_360p", "MKV_720p"
  size?: string;
  urls: Array<{ title: string; url: string }>;
}

export interface RawEpisodeDetail {
  title: string;
  animeId?: string;
  animeTitle?: string;
  poster?: string;
  releaseTime?: string;
  defaultStreamingUrl?: string | null;
  hasPrevEpisode?: boolean;
  hasNextEpisode?: boolean;
  prevEpisode?: { title: string; episodeId: string } | null;
  nextEpisode?: { title: string; episodeId: string } | null;
  // New real structure
  server?: {
    qualities: RawQualityGroup[];
  };
  downloadUrl?: {
    qualities: RawDownloadUrl[];
  };
  info?: {
    credit?: string;
    encoder?: string;
    duration?: string;
    type?: string;
    genreList?: RawGenre[];
  };
}

// /anime/server/:serverId returns { data: { url: string } }
export interface RawServerResponse {
  url: string;
}

// /anime/unlimited — all anime grouped A-Z
export interface RawAllAnimeItem {
  title: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface RawAllAnimeGroup {
  startWith: string;
  animeList: RawAllAnimeItem[];
}

// /anime/batch/:slug — batch download
export interface RawBatchDownloadUrl {
  title: string;
  size?: string;
  urls: Array<{ title: string; url: string }>;
}

export interface RawBatchFormat {
  title: string;
  qualities: RawBatchDownloadUrl[];
}

export interface RawBatchDetail {
  title: string;
  animeId?: string;
  poster?: string;
  japanese?: string;
  type?: string;
  score?: string;
  episodes?: number;
  duration?: string;
  studios?: string;
  producers?: string;
  aired?: string;
  credit?: string;
  genreList?: RawGenre[];
  downloadUrl?: {
    formats: RawBatchFormat[];
  };
}

// Legacy shape kept for backwards compat
export interface RawServer {
  serverId: string;
  serverName?: string;
  streamingUrl?: string | null;
  iframe?: string | null;
}

export interface RawApiResponse<T> {
  status?: string;
  statusCode?: number;
  ok?: boolean;
  data?: T;
  pagination?: null | {
    currentPage?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

// ─── Normalized App Shapes ────────────────────────────────────────────────────

export interface Genre {
  name: string;
  slug: string;
}

export interface Episode {
  slug: string;
  title: string;
  number?: number;
  date?: string;
}

export interface Anime {
  slug: string;
  title: string;
  poster: string;
  synopsis?: string;
  status?: string;
  genres?: Genre[];
  rating?: string;
  year?: string;
  studio?: string;
  duration?: string;
  totalEpisode?: number;
  season?: string;
  type?: string;
  releaseDay?: string;
  latestReleaseDate?: string;
}

export interface AnimeDetail extends Anime {
  japanese?: string;
  producers?: string;
  aired?: string;
  episodes?: Episode[];
  related?: Anime[];
  batch?: null;
}

// A resolved server entry (after fetching serverId → embed URL)
export interface Server {
  serverId: string;
  serverName: string;
  url?: string;
  iframe?: string;
}

// A quality group with list of unresolved server entries
export interface QualityGroup {
  quality: string;           // "360p" | "480p" | "720p"
  servers: StreamServer[];
}

// An individual server within a quality group
export interface StreamServer {
  serverId: string;
  serverName: string;
}

export interface DownloadLink {
  quality: string;
  size?: string;
  urls: Array<{ title: string; url: string }>;
}

export interface EpisodeDetail {
  title: string;
  slug: string;
  poster?: string;
  animeSlug?: string;
  animeTitle?: string;
  releaseTime?: string;
  defaultStreamingUrl?: string | null;
  // Quality-grouped server list (unresolved; need /server/:id to get embed URL)
  qualityGroups: QualityGroup[];
  downloadLinks: DownloadLink[];
  prevEpisode?: { slug: string; title: string } | null;
  nextEpisode?: { slug: string; title: string } | null;
  // Legacy flat servers list (kept for backward compat)
  servers?: Server[];
}

export interface ScheduleDay {
  day: string;
  animes: Anime[];
}

// All Anime (A-Z grouped)
export interface AllAnimeGroup {
  letter: string;
  items: Array<{ slug: string; title: string }>;
}

// Batch download
export interface BatchFormat {
  title: string;
  qualities: DownloadLink[];
}

export interface BatchDetail {
  slug: string;
  title: string;
  poster?: string;
  japanese?: string;
  type?: string;
  rating?: string;
  episodes?: number;
  duration?: string;
  studio?: string;
  producers?: string;
  aired?: string;
  credit?: string;
  genres?: Genre[];
  formats: BatchFormat[];
}

export interface PaginatedResult {
  data: Anime[];
  totalPages: number;
  hasNext: boolean;
}

export interface FavoriteItem {
  slug: string;
  title: string;
  poster: string;
  status?: string;
  genres?: Genre[];
  addedAt: number;
}

export interface HistoryItem {
  animeSlug: string;
  animeTitle: string;
  animePoster: string;
  episodeSlug: string;
  episodeTitle: string;
  watchedAt: number;
}
