import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, ArrowLeft, Play, List, X,
  Download, Loader2, AlertCircle, Server as ServerIcon, Wifi,
} from "lucide-react";
import { useEpisode, useAnimeDetail, useServerUrl } from "@/hooks/useAnimeQuery";
import { useAppStore } from "@/stores/appStore";
import type { StreamServer, Episode, QualityGroup } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// ── ServerResolver: fetches the embed URL for a selected server ───────────────
function ServerResolver({
  serverId,
  serverName,
  onResolved,
}: {
  serverId: string;
  serverName: string;
  onResolved: (url: string) => void;
}) {
  const { data, isLoading, isError } = useServerUrl(serverId, true);

  useEffect(() => {
    if (data) onResolved(data);
  }, [data, onResolved]);

  if (isLoading) return (
    <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-3">
      <Loader2 size={32} className="animate-spin text-[#ff8c94]" />
      <p className="text-[#a9abaf] text-sm">Connecting to <span className="text-[#f8f9fe] font-semibold">{serverName}</span>…</p>
    </div>
  );

  if (isError) return (
    <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-3">
      <AlertCircle size={32} className="text-rose-500" />
      <p className="text-[#a9abaf] text-sm">Failed to connect to <span className="text-[#f8f9fe] font-semibold">{serverName}</span></p>
      <p className="text-[#737679] text-xs">Try another server</p>
    </div>
  );

  return null;
}

// ── VideoPlayer ───────────────────────────────────────────────────────────────
function VideoPlayer({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <iframe
      key={embedUrl}
      src={embedUrl}
      title={title}
      className="w-full h-full"
      allowFullScreen
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
    />
  );
}

// ── QualityServerPanel ────────────────────────────────────────────────────────
function QualityServerPanel({
  qualityGroups,
  selectedQuality,
  selectedServer,
  onSelectQuality,
  onSelectServer,
}: {
  qualityGroups: QualityGroup[];
  selectedQuality: string;
  selectedServer: StreamServer | null;
  onSelectQuality: (q: string) => void;
  onSelectServer: (s: StreamServer) => void;
}) {
  const currentGroup = qualityGroups.find((g) => g.quality === selectedQuality);

  return (
    <div className="bg-[#101417] rounded-2xl border border-[#22262b] overflow-hidden">
      {/* Quality tabs */}
      <div className="flex border-b border-[#22262b]">
        <div className="flex items-center gap-1.5 px-5 py-3 border-r border-[#22262b] shrink-0">
          <Wifi size={14} className="text-[#ff8c94]" />
          <span className="text-xs font-black text-[#f8f9fe] uppercase tracking-widest">Quality</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
          {qualityGroups.map((g) => (
            <button
              key={g.quality}
              onClick={() => onSelectQuality(g.quality)}
              className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold border transition-all min-h-[36px] ${
                g.quality === selectedQuality
                  ? "text-black border-[#ff8c94]"
                  : "bg-[#161a1e] border-[#22262b] text-[#a9abaf] hover:border-[#ff8c94]/40 hover:text-[#f8f9fe]"
              }`}
              style={g.quality === selectedQuality ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
            >
              {g.quality}
            </button>
          ))}
        </div>
      </div>

      {/* Server list for selected quality */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <ServerIcon size={13} className="text-[#a9abaf]" />
          <span className="text-xs font-bold text-[#a9abaf] uppercase tracking-widest">
            Select Server ({currentGroup?.servers.length ?? 0} available)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentGroup?.servers.map((s) => {
            const isActive = selectedServer?.serverId === s.serverId;
            return (
              <button
                key={s.serverId}
                onClick={() => onSelectServer(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all min-h-[44px] capitalize ${
                  isActive
                    ? "text-black border-[#ff8c94] shadow-lg shadow-[#ff8c94]/20"
                    : "bg-[#161a1e] border-[#22262b] text-[#a9abaf] hover:border-[#ff8c94]/40 hover:text-[#f8f9fe]"
                }`}
                style={isActive ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
              >
                {s.serverName}
              </button>
            );
          })}
          {!currentGroup?.servers.length && (
            <p className="text-[#737679] text-sm">No servers available for this quality.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DownloadPanel ─────────────────────────────────────────────────────────────
function DownloadPanel({ qualityGroups }: { qualityGroups: QualityGroup[] }) {
  return null; // Download links sourced from episode's downloadLinks — handled in main
}

// ── Main WatchPage ────────────────────────────────────────────────────────────
export default function WatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: episode, isLoading, isError, refetch } = useEpisode(slug!);

  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedServer, setSelectedServer] = useState<StreamServer | null>(null);
  // The resolved embed URL for the chosen server
  const [resolvedEmbedUrl, setResolvedEmbedUrl] = useState<string | null>(null);
  // Whether we're actively resolving (waiting for ServerUrl hook)
  const [resolving, setResolving] = useState(false);
  const [showEpList, setShowEpList] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const { addHistory } = useAppStore();
  const animeSlug = episode?.animeSlug || "";
  const { data: animeDetail } = useAnimeDetail(animeSlug);
  const episodes: Episode[] = animeDetail?.episodes || [];

  // On episode load: auto-select first quality + first server, use defaultStreamingUrl
  useEffect(() => {
    if (!episode) return;

    const groups = episode.qualityGroups;
    if (groups && groups.length > 0) {
      // Prefer 480p as default, otherwise first available
      const preferred = groups.find((g) => g.quality === "480p") || groups[0];
      setSelectedQuality(preferred.quality);
      // Auto-select first server of that quality (but don't auto-resolve; wait for user click)
      setSelectedServer(null);
    }

    // Use defaultStreamingUrl as the immediate player content
    if (episode.defaultStreamingUrl) {
      setResolvedEmbedUrl(episode.defaultStreamingUrl);
    }
  }, [episode?.slug]);

  // Track history
  useEffect(() => {
    if (episode && slug) {
      addHistory({
        animeSlug: episode.animeSlug || "",
        animeTitle: episode.animeTitle || episode.title,
        animePoster: episode.poster || "",
        episodeSlug: slug,
        episodeTitle: episode.title,
      });
    }
  }, [episode?.title, slug]);

  const handleSelectQuality = (q: string) => {
    setSelectedQuality(q);
    setSelectedServer(null);
    // Don't clear the current stream — let user keep watching while choosing
  };

  const handleSelectServer = (s: StreamServer) => {
    setSelectedServer(s);
    setResolving(true);
    setResolvedEmbedUrl(null); // clear while resolving
  };

  const handleServerResolved = useCallback((url: string) => {
    setResolvedEmbedUrl(url);
    setResolving(false);
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="bg-[#0b0e11] min-h-screen pt-16">
      <div className="w-full bg-black" style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 64px)" }}>
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#ff8c94]" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        {[64, 40, 48].map((h, i) => (
          <div key={i} className={`h-${h === 64 ? "6" : h === 40 ? "4" : "10"} bg-[#1c2024] rounded animate-pulse`} style={{ height: h }} />
        ))}
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !episode) return (
    <div className="bg-[#0b0e11] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
        <p className="text-[#a9abaf] text-lg mb-4">Failed to load episode.</p>
        <button
          onClick={refetch}
          className="px-6 py-2.5 text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const hasQualities = episode.qualityGroups && episode.qualityGroups.length > 0;
  const hasDownloads = episode.downloadLinks && episode.downloadLinks.length > 0;
  const showPlayer = !!resolvedEmbedUrl && !resolving;

  return (
    <div className="bg-[#0b0e11] min-h-screen">

      {/* ── Video Player ──────────────────────────────────────────────── */}
      <div
        className="w-full bg-black pt-16"
        style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 64px)" }}
      >
        {/* Resolving spinner (fetching server URL) */}
        {resolving && selectedServer && (
          <ServerResolver
            serverId={selectedServer.serverId}
            serverName={selectedServer.serverName}
            onResolved={handleServerResolved}
          />
        )}

        {/* Embed player */}
        {showPlayer && (
          <VideoPlayer embedUrl={resolvedEmbedUrl!} title={episode.title} />
        )}

        {/* No stream yet */}
        {!showPlayer && !resolving && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full border border-[#22262b] flex items-center justify-center">
              <Play size={32} className="text-[#45484c] ml-1" />
            </div>
            <p className="text-[#a9abaf] text-sm">
              {hasQualities ? "Select a quality and server to start watching" : "No stream available for this episode"}
            </p>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Controls ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Title bar */}
            <div className="flex items-start gap-3">
              {episode.animeSlug && (
                <Link
                  to={`/anime/${episode.animeSlug}`}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#a9abaf] hover:text-[#f8f9fe] text-sm font-medium border border-[#22262b] hover:border-[#45484c] bg-[#101417] transition-all"
                >
                  <ArrowLeft size={14} /> Detail
                </Link>
              )}
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-black font-headline text-[#f8f9fe] line-clamp-2 leading-tight">
                  {episode.title}
                </h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {episode.animeTitle && (
                    <span className="text-sm text-[#737679]">{episode.animeTitle}</span>
                  )}
                  {episode.releaseTime && (
                    <span className="text-xs text-[#45484c]">{episode.releaseTime}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center gap-3">
              {episode.prevEpisode ? (
                <Link
                  to={`/watch/${episode.prevEpisode.slug}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#22262b] text-sm font-bold text-[#a9abaf] hover:text-[#f8f9fe] hover:border-[#ff8c94]/30 bg-[#101417] transition-all"
                >
                  <ChevronLeft size={15} /> Prev
                </Link>
              ) : (
                <button disabled className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#22262b]/40 text-sm font-bold text-[#45484c] bg-[#101417]/40 cursor-not-allowed">
                  <ChevronLeft size={15} /> Prev
                </button>
              )}

              <div className="flex-1" />

              {/* Episode list toggle (mobile) */}
              {episodes.length > 0 && (
                <button
                  onClick={() => setShowEpList(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-[#22262b] text-sm font-bold text-[#a9abaf] hover:text-[#f8f9fe] bg-[#101417] transition-all"
                >
                  <List size={14} /> Episodes
                </button>
              )}

              {episode.nextEpisode ? (
                <Link
                  to={`/watch/${episode.nextEpisode.slug}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20 text-black"
                  style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
                >
                  Next <ChevronRight size={15} />
                </Link>
              ) : (
                <button disabled className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#45484c] bg-[#1c2024]/40 border border-[#22262b]/40 cursor-not-allowed">
                  Next <ChevronRight size={15} />
                </button>
              )}
            </div>

            {/* Quality + Server selection */}
            {hasQualities && (
              <QualityServerPanel
                qualityGroups={episode.qualityGroups}
                selectedQuality={selectedQuality}
                selectedServer={selectedServer}
                onSelectQuality={handleSelectQuality}
                onSelectServer={handleSelectServer}
              />
            )}

            {/* Default stream hint */}
            {episode.defaultStreamingUrl && !selectedServer && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#ff8c94]/8 border border-[#ff8c94]/20 rounded-xl">
                <Wifi size={14} className="text-[#ff8c94] shrink-0" />
                <p className="text-xs text-[#a9abaf]">
                  Playing default stream. Select a quality and server above to switch.
                </p>
              </div>
            )}

            {/* No stream fallback */}
            {!hasQualities && !episode.defaultStreamingUrl && (
              <div className="flex flex-col items-center gap-2 px-6 py-8 bg-[#101417] border border-[#22262b] rounded-2xl text-center">
                <ServerIcon size={28} className="text-[#45484c]" />
                <p className="text-[#737679] text-sm">No streaming servers available for this episode yet.</p>
              </div>
            )}

            {/* Download section */}
            {hasDownloads && (
              <div className="bg-[#101417] rounded-2xl border border-[#22262b] overflow-hidden">
                <button
                  onClick={() => setShowDownloads(!showDownloads)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#161a1e] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download size={15} className="text-[#ff8c94]" />
                    <span className="text-sm font-black text-[#f8f9fe] uppercase tracking-widest">Download</span>
                    <span className="text-xs text-[#737679]">({episode.downloadLinks.length} qualities)</span>
                  </div>
                  <ChevronRight size={14} className={`text-[#737679] transition-transform ${showDownloads ? "rotate-90" : ""}`} />
                </button>

                {showDownloads && (
                  <div className="px-5 pb-5 space-y-4 border-t border-[#22262b] pt-4">
                    {episode.downloadLinks.map((dl) => (
                      <div key={dl.quality}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-[#ff8c94] uppercase tracking-widest">{dl.quality}</span>
                          {dl.size && <span className="text-xs text-[#737679]">({dl.size})</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dl.urls.map((u) => (
                            <a
                              key={u.title + u.url}
                              href={u.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg bg-[#161a1e] border border-[#22262b] text-xs font-bold text-[#a9abaf] hover:text-[#f8f9fe] hover:border-[#ff8c94]/40 transition-all min-h-[36px] flex items-center"
                            >
                              {u.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Anime info bar */}
            {animeDetail && (
              <div className="flex items-center gap-4 p-4 bg-[#101417] rounded-2xl border border-[#22262b]">
                <img
                  src={animeDetail.poster || FALLBACK}
                  alt={animeDetail.title}
                  className="w-14 h-20 object-cover rounded-xl shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black font-headline text-[#f8f9fe] text-sm line-clamp-1">{animeDetail.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {animeDetail.genres?.slice(0, 3).map((g) => (
                      <span key={g.slug} className="text-[10px] px-2 py-0.5 rounded-full bg-[#b08af7]/15 text-[#b08af7] border border-[#b08af7]/20 font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#737679] mt-1.5">
                    {animeDetail.status}{animeDetail.studio ? ` • ${animeDetail.studio}` : ""}
                  </p>
                </div>
                <Link
                  to={`/anime/${animeSlug}`}
                  className="shrink-0 px-3 py-2 rounded-xl border border-[#22262b] text-xs font-bold text-[#a9abaf] hover:text-[#ff8c94] hover:border-[#ff8c94]/30 bg-[#161a1e] transition-all"
                >
                  Details
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: Episode List sidebar (desktop) ──────────────── */}
          {episodes.length > 0 && (
            <div className="hidden lg:block w-80 shrink-0">
              <div className="bg-[#101417] rounded-2xl border border-[#22262b] overflow-hidden sticky top-24">
                <div className="px-5 py-4 border-b border-[#22262b] flex items-center justify-between">
                  <h3 className="font-black font-headline text-[#f8f9fe] text-sm uppercase tracking-widest flex items-center gap-2">
                    <List size={14} className="text-[#ff8c94]" /> Episodes
                  </h3>
                  <span className="text-xs text-[#737679]">{episodes.length} eps</span>
                </div>
                <div className="overflow-y-auto max-h-[60vh]">
                  {episodes.map((ep) => {
                    const isCurrent = ep.slug === slug;
                    return (
                      <Link
                        key={ep.slug}
                        to={`/watch/${ep.slug}`}
                        className={`flex items-center gap-3 px-4 py-3.5 border-b border-[#22262b] last:border-0 transition-all ${
                          isCurrent ? "bg-[#ff8c94]/10" : "hover:bg-[#161a1e]"
                        }`}
                      >
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                          isCurrent ? "bg-[#ff8c94] text-black" : "bg-[#22262b] text-[#737679]"
                        }`}>
                          {ep.number ?? "?"}
                        </span>
                        <span className={`text-xs font-medium line-clamp-2 leading-tight ${
                          isCurrent ? "text-[#ff8c94]" : "text-[#a9abaf]"
                        }`}>
                          {ep.title}
                        </span>
                        {isCurrent && (
                          <Play size={10} fill="#ff8c94" className="text-[#ff8c94] shrink-0 ml-auto" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile episode list overlay ───────────────────────────────── */}
      {showEpList && episodes.length > 0 && (
        <div className="fixed inset-0 z-50 bg-[#0b0e11]/90 backdrop-blur-md lg:hidden">
          <div className="h-full flex flex-col max-w-lg mx-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#22262b] bg-[#101417]">
              <h3 className="font-black font-headline text-[#f8f9fe] text-base uppercase tracking-widest flex items-center gap-2">
                <List size={16} className="text-[#ff8c94]" /> Episodes ({episodes.length})
              </h3>
              <button onClick={() => setShowEpList(false)} className="p-2 rounded-full hover:bg-[#1c2024] text-[#a9abaf] transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 bg-[#0b0e11]">
              {episodes.map((ep) => {
                const isCurrent = ep.slug === slug;
                return (
                  <Link
                    key={ep.slug}
                    to={`/watch/${ep.slug}`}
                    onClick={() => setShowEpList(false)}
                    className={`flex items-center gap-3 px-5 py-4 border-b border-[#22262b] last:border-0 transition-all ${
                      isCurrent ? "bg-[#ff8c94]/10" : "hover:bg-[#161a1e]"
                    }`}
                  >
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                      isCurrent ? "bg-[#ff8c94] text-black" : "bg-[#22262b] text-[#737679]"
                    }`}>
                      EP {ep.number ?? "?"}
                    </span>
                    <span className={`text-sm font-medium line-clamp-2 leading-tight ${
                      isCurrent ? "text-[#ff8c94]" : "text-[#a9abaf]"
                    }`}>
                      {ep.title}
                    </span>
                    {isCurrent && <Play size={10} fill="#ff8c94" className="text-[#ff8c94] shrink-0 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
