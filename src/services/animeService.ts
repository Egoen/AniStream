import type {
  RawApiResponse,
  RawAnimeListItem,
  RawAnimeDetail,
  RawEpisodeDetail,
  RawScheduleDay,
  RawServerResponse,
  RawAllAnimeGroup,
  RawBatchDetail,
  Anime,
  AnimeDetail,
  EpisodeDetail,
  Episode,
  Genre,
  ScheduleDay,
  PaginatedResult,
  RawGenre,
  QualityGroup,
  DownloadLink,
  AllAnimeGroup,
  BatchDetail,
} from "@/types/anime";

const BASE_URL = "https://www.sankavollerei.com/anime";
const DEFAULT_TIMEOUT = 15000;

// ─── HTTP ─────────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function apiGet<T>(path: string): Promise<RawApiResponse<T>> {
  const res = await fetchWithTimeout(`${BASE_URL}${path}`);
  return res.json();
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeGenre(g: RawGenre): Genre {
  return { name: g.title, slug: g.genreId };
}

function normalizeSynopsis(syn: RawAnimeDetail["synopsis"]): string {
  if (!syn) return "";
  if (typeof syn === "string") return syn;
  if (syn.paragraphs && Array.isArray(syn.paragraphs)) {
    return syn.paragraphs.filter(Boolean).join("\n\n").trim();
  }
  return "";
}

function normalizeAnimeItem(raw: RawAnimeListItem): Anime {
  return {
    slug: raw.animeId || raw.slug || "",
    title: raw.title,
    poster: raw.poster,
    status: raw.status,
    genres: raw.genreList?.map(normalizeGenre),
    rating: raw.score && !isNaN(Number(raw.score)) ? raw.score : undefined,
    releaseDay: raw.releaseDay,
    latestReleaseDate: raw.latestReleaseDate || raw.lastReleaseDate,
    totalEpisode: typeof raw.episodes === "number" ? raw.episodes : undefined,
  };
}

function normalizeDetail(raw: RawAnimeDetail): AnimeDetail {
  const yearMatch = raw.aired?.match(/\d{4}/);
  const episodes: Episode[] = (raw.episodeList || []).map((ep) => ({
    slug: ep.episodeId,
    title: ep.title,
    number: ep.eps,
    date: ep.date,
  }));
  return {
    slug: "",
    title: raw.title,
    poster: raw.poster,
    japanese: raw.japanese,
    synopsis: normalizeSynopsis(raw.synopsis),
    status: raw.status,
    genres: raw.genreList?.map(normalizeGenre),
    rating: raw.score || undefined,
    year: yearMatch ? yearMatch[0] : undefined,
    studio: raw.studios,
    duration: raw.duration,
    type: raw.type,
    producers: raw.producers,
    aired: raw.aired,
    episodes,
    related: (raw.recommendedAnimeList || []).map(normalizeAnimeItem),
  };
}

function normalizeEpisodeDetail(raw: RawEpisodeDetail, slug: string): EpisodeDetail {
  // Parse quality groups from real API structure
  const qualityGroups: QualityGroup[] = (raw.server?.qualities || []).map((qg) => ({
    quality: qg.title,
    servers: (qg.serverList || []).map((s) => ({
      serverId: s.serverId,
      serverName: s.title,
    })),
  }));

  // Parse download links
  const downloadLinks: DownloadLink[] = (raw.downloadUrl?.qualities || []).map((dl) => ({
    quality: dl.title,
    size: dl.size,
    urls: dl.urls || [],
  }));

  return {
    slug,
    title: raw.title,
    poster: raw.poster,
    animeSlug: raw.animeId,
    animeTitle: raw.animeTitle,
    releaseTime: raw.releaseTime,
    defaultStreamingUrl: raw.defaultStreamingUrl || null,
    qualityGroups,
    downloadLinks,
    prevEpisode: raw.prevEpisode
      ? { slug: raw.prevEpisode.episodeId, title: raw.prevEpisode.title }
      : null,
    nextEpisode: raw.nextEpisode
      ? { slug: raw.nextEpisode.episodeId, title: raw.nextEpisode.title }
      : null,
  };
}

function normalizeSchedule(raw: RawScheduleDay[]): ScheduleDay[] {
  return raw.map((day) => ({
    day: day.day,
    animes: (day.anime_list || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      poster: a.poster,
    })),
  }));
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const animeService = {
  // Home — returns ongoing & completed lists
  async getHome(): Promise<{ ongoing: Anime[]; completed: Anime[] }> {
    const res = await apiGet<{
      ongoing: { animeList: RawAnimeListItem[] };
      completed: { animeList: RawAnimeListItem[] };
    }>("/home");
    const d = res.data;
    return {
      ongoing: (d?.ongoing?.animeList || []).map(normalizeAnimeItem),
      completed: (d?.completed?.animeList || []).map(normalizeAnimeItem),
    };
  },

  // Ongoing list
  async getOngoing(page = 1): Promise<PaginatedResult> {
    const res = await apiGet<{ animeList: RawAnimeListItem[] }>(`/ongoing-anime?page=${page}`);
    const list = (res.data?.animeList || []).map(normalizeAnimeItem);
    return { data: list, totalPages: 0, hasNext: list.length >= 20 };
  },

  // Completed list
  async getCompleted(page = 1): Promise<PaginatedResult> {
    const res = await apiGet<{ animeList: RawAnimeListItem[] }>(`/complete-anime?page=${page}`);
    const list = (res.data?.animeList || []).map(normalizeAnimeItem);
    return { data: list, totalPages: 0, hasNext: list.length >= 20 };
  },

  // Anime detail
  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const res = await apiGet<RawAnimeDetail>(`/anime/${slug}`);
    const detail = normalizeDetail(res.data!);
    detail.slug = slug;
    return detail;
  },

  // Episode detail — parses real server.qualities structure
  async getEpisode(slug: string): Promise<EpisodeDetail> {
    const res = await apiGet<RawEpisodeDetail>(`/episode/${slug}`);
    return normalizeEpisodeDetail(res.data!, slug);
  },

  // Resolve a server embed URL: GET /server/:serverId → { data: { url } }
  async getServerUrl(serverId: string): Promise<string> {
    const res = await apiGet<RawServerResponse>(`/server/${serverId}`);
    const url = res.data?.url;
    if (!url) throw new Error("No URL returned for server " + serverId);
    return url;
  },

  // Search
  async search(keyword: string): Promise<Anime[]> {
    const res = await apiGet<{ animeList: RawAnimeListItem[] }>(
      `/search/${encodeURIComponent(keyword)}`
    );
    return (res.data?.animeList || []).map(normalizeAnimeItem);
  },

  // Schedule
  async getSchedule(): Promise<ScheduleDay[]> {
    const res = await apiGet<RawScheduleDay[]>("/schedule");
    const raw = res.data;
    if (Array.isArray(raw)) return normalizeSchedule(raw);
    return [];
  },

  // Genres list
  async getGenres(): Promise<Genre[]> {
    const res = await apiGet<{ genreList: RawGenre[] }>("/genre");
    return (res.data?.genreList || []).map(normalizeGenre);
  },

  // All anime (A-Z grouped) from /unlimited
  async getAllAnime(): Promise<AllAnimeGroup[]> {
    const res = await apiGet<{ list: RawAllAnimeGroup[] }>("/unlimited");
    return (res.data?.list || []).map((g) => ({
      letter: g.startWith,
      items: (g.animeList || []).map((a) => ({
        slug: a.animeId,
        title: a.title,
      })),
    }));
  },

  // Batch download detail
  async getBatch(slug: string): Promise<BatchDetail> {
    const res = await apiGet<RawBatchDetail>(`/batch/${slug}`);
    const d = res.data!;
    return {
      slug: d.animeId || slug,
      title: d.title,
      poster: d.poster,
      japanese: d.japanese,
      type: d.type,
      rating: d.score,
      episodes: d.episodes,
      duration: d.duration,
      studio: d.studios,
      producers: d.producers,
      aired: d.aired,
      credit: d.credit,
      genres: d.genreList?.map(normalizeGenre),
      formats: (d.downloadUrl?.formats || []).map((fmt) => ({
        title: fmt.title,
        qualities: (fmt.qualities || []).map((q) => ({
          quality: q.title,
          size: q.size,
          urls: q.urls || [],
        })),
      })),
    };
  },

  // Genre anime list
  async getGenreAnime(slug: string, page = 1): Promise<PaginatedResult> {
    const res = await apiGet<{ animeList: RawAnimeListItem[] }>(
      `/genre/${slug}?page=${page}`
    );
    const list = (res.data?.animeList || []).map(normalizeAnimeItem);
    return { data: list, totalPages: 0, hasNext: list.length >= 20 };
  },
};
