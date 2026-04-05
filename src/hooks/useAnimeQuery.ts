import { useQuery } from "@tanstack/react-query";
import { animeService } from "@/services/animeService";

const STALE = 5 * 60 * 1000;

export const useHome = () =>
  useQuery({
    queryKey: ["home"],
    queryFn: animeService.getHome,
    staleTime: STALE,
  });

export const useOngoing = (page: number) =>
  useQuery({
    queryKey: ["ongoing", page],
    queryFn: () => animeService.getOngoing(page),
    staleTime: STALE,
  });

export const useCompleted = (page: number) =>
  useQuery({
    queryKey: ["completed", page],
    queryFn: () => animeService.getCompleted(page),
    staleTime: STALE,
  });

export const useAnimeDetail = (slug: string) =>
  useQuery({
    queryKey: ["anime", slug],
    queryFn: () => animeService.getAnimeDetail(slug),
    staleTime: STALE,
    enabled: !!slug,
  });

export const useEpisode = (slug: string) =>
  useQuery({
    queryKey: ["episode", slug],
    queryFn: () => animeService.getEpisode(slug),
    staleTime: STALE,
    enabled: !!slug,
  });

// Resolves serverId → embed URL from /anime/server/:serverId
export const useServerUrl = (serverId: string, enabled: boolean) =>
  useQuery({
    queryKey: ["server-url", serverId],
    queryFn: () => animeService.getServerUrl(serverId),
    staleTime: 3 * 60 * 1000,
    enabled: !!serverId && enabled,
    retry: 2,
  });

export const useSearch = (keyword: string) =>
  useQuery({
    queryKey: ["search", keyword],
    queryFn: () => animeService.search(keyword),
    staleTime: 2 * 60 * 1000,
    enabled: keyword.length >= 2,
  });

export const useSchedule = () =>
  useQuery({
    queryKey: ["schedule"],
    queryFn: animeService.getSchedule,
    staleTime: 10 * 60 * 1000,
  });

export const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: animeService.getGenres,
    staleTime: 30 * 60 * 1000,
  });

export const useAllAnime = () =>
  useQuery({
    queryKey: ["all-anime"],
    queryFn: animeService.getAllAnime,
    staleTime: 30 * 60 * 1000,
  });

export const useBatch = (slug: string) =>
  useQuery({
    queryKey: ["batch", slug],
    queryFn: () => animeService.getBatch(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });

export const useGenreAnime = (slug: string, page: number) =>
  useQuery({
    queryKey: ["genre-anime", slug, page],
    queryFn: () => animeService.getGenreAnime(slug, page),
    staleTime: STALE,
    enabled: !!slug,
  });
