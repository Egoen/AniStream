import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Heart, Star, Calendar, Clock, Tv, Building2, ChevronRight, ArrowLeft } from "lucide-react";
import { useAnimeDetail } from "@/hooks/useAnimeQuery";
import { useAppStore } from "@/stores/appStore";
import type { Episode } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="bg-[#0b0e11] min-h-screen pt-20">
      <div className="h-[420px] bg-[#1c2024] animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-32 relative z-10 pb-24">
        <div className="flex gap-6 mb-8">
          <div className="w-44 h-64 rounded-2xl bg-[#22262b] animate-pulse shrink-0" />
          <div className="flex-1 space-y-4 pt-36">
            <div className="h-8 bg-[#22262b] rounded animate-pulse w-3/4" />
            <div className="h-4 bg-[#22262b] rounded animate-pulse w-1/2" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 w-16 bg-[#22262b] rounded-full animate-pulse" />)}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-[#161a1e] rounded-2xl animate-pulse" />
          <div className="h-60 bg-[#161a1e] rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Episode Item ──────────────────────────────────────────────────────────────
function EpisodeItem({ ep, isLatest }: { ep: Episode; isLatest?: boolean }) {
  return (
    <Link
      to={`/watch/${ep.slug}`}
      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all group min-h-[52px] ${
        isLatest
          ? "bg-[#ff8c94]/10 border-[#ff8c94]/30 hover:bg-[#ff8c94]/20"
          : "bg-[#161a1e] border-[#22262b] hover:border-[#ff8c94]/30 hover:bg-[#1c2024]"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`text-xs font-black px-2 py-0.5 rounded shrink-0 ${isLatest ? "bg-[#ff8c94] text-black" : "bg-[#22262b] text-[#a9abaf]"}`}>
          EP {ep.number ?? "?"}
        </span>
        <span className="text-sm font-medium text-[#f8f9fe] line-clamp-1 group-hover:text-[#ff8c94] transition-colors">
          {ep.title}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {ep.date && <span className="text-xs text-[#737679] hidden sm:block">{ep.date}</span>}
        <ChevronRight size={14} className={`transition-colors ${isLatest ? "text-[#ff8c94]" : "text-[#737679] group-hover:text-[#ff8c94]"}`} />
      </div>
    </Link>
  );
}

// ── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ anime }: { anime: { slug: string; title: string; poster: string } }) {
  return (
    <Link to={`/anime/${anime.slug}`} className="group cursor-pointer flex-none w-32 sm:w-36">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_16px_rgba(255,140,148,0.2)]">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[#ff8c94] flex items-center justify-center shadow-lg">
            <Play size={14} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#f8f9fe] line-clamp-2 leading-tight group-hover:text-[#ff8c94] transition-colors">
        {anime.title}
      </p>
    </Link>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnimeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: anime, isLoading, isError, refetch } = useAnimeDetail(slug!);
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();
  const [showAllEps, setShowAllEps] = useState(false);
  const fav = slug ? isFavorite(slug) : false;

  const toggleFav = () => {
    if (!anime) return;
    if (fav) removeFavorite(anime.slug);
    else addFavorite({ slug: anime.slug, title: anime.title, poster: anime.poster, status: anime.status, genres: anime.genres, addedAt: Date.now() });
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !anime) return (
    <div className="bg-[#0b0e11] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#a9abaf] text-lg mb-4">Gagal memuat detail anime.</p>
        <button onClick={refetch} className="px-6 py-2.5 bg-[#ff8c94] text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
          Coba Lagi
        </button>
      </div>
    </div>
  );

  const episodes: Episode[] = anime.episodes || [];
  const latestEp = episodes[0];
  const firstEp = episodes[episodes.length - 1];
  const displayedEps = showAllEps ? episodes : episodes.slice(0, 12);

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      {/* ── Backdrop Hero ───────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] max-h-[520px]">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.2)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0b0e11 0%, rgba(11,14,17,0.6) 60%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0b0e11 0%, transparent 60%)" }} />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-24 left-6 md:left-8 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#a9abaf] hover:text-[#f8f9fe] transition-colors text-sm font-medium"
          style={{ background: "rgba(22,26,30,0.8)", backdropFilter: "blur(12px)" }}
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-48 relative z-10 pb-24">
        {/* Poster + Info row */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {/* Poster */}
          <div className="shrink-0 w-36 sm:w-44 md:w-52">
            <img
              src={anime.poster || FALLBACK}
              alt={anime.title}
              className="w-full aspect-[3/4] object-cover rounded-2xl border-2 border-[#ff8c94]/20 shadow-2xl shadow-black/50"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-0 sm:pt-28">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${
                anime.status === "Ongoing" ? "bg-[#ff8c94]/20 text-[#ff8c94] border border-[#ff8c94]/30" : "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
              }`}>
                {anime.status || "Unknown"}
              </span>
              {anime.type && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded bg-[#b08af7]/20 text-[#b08af7] border border-[#b08af7]/30 uppercase tracking-widest">
                  {anime.type}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tight text-[#f8f9fe] leading-tight mb-1">
              {anime.title}
            </h1>
            {anime.japanese && (
              <p className="text-sm text-[#737679] mb-4 font-medium">{anime.japanese}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              {anime.rating && !isNaN(Number(anime.rating)) && (
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#f59e0b" className="text-amber-400" />
                  <span className="font-bold text-amber-400">{Number(anime.rating).toFixed(2)}</span>
                </div>
              )}
              {anime.year && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Calendar size={13} /><span>{anime.year}</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Clock size={13} /><span>{anime.duration}</span>
                </div>
              )}
              {anime.studio && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Building2 size={13} /><span>{anime.studio}</span>
                </div>
              )}
              {episodes.length > 0 && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Tv size={13} /><span>{episodes.length} Episodes</span>
                </div>
              )}
            </div>

            {/* Genre pills */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {anime.genres.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/genre/${g.slug}`}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#b08af7]/15 text-[#b08af7] border border-[#b08af7]/25 hover:bg-[#b08af7]/25 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              {latestEp && (
                <Link
                  to={`/watch/${latestEp.slug}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
                  style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
                >
                  <Play size={15} fill="black" className="text-black" />
                  <span className="text-black">Watch Now</span>
                </Link>
              )}
              {firstEp && firstEp.slug !== latestEp?.slug && (
                <Link
                  to={`/watch/${firstEp.slug}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#45484c]/40 text-[#f8f9fe] font-bold font-headline uppercase tracking-wider text-sm hover:bg-[#1c2024] transition-all"
                  style={{ background: "rgba(34,38,43,0.6)", backdropFilter: "blur(12px)" }}
                >
                  <Play size={14} /> Ep 1
                </Link>
              )}
              <button
                onClick={toggleFav}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold font-headline uppercase tracking-wider text-sm transition-all ${
                  fav
                    ? "bg-[#ff8c94]/15 border-[#ff8c94]/40 text-[#ff8c94] hover:bg-[#ff8c94]/25"
                    : "border-[#45484c]/40 text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#1c2024]"
                }`}
                style={!fav ? { background: "rgba(34,38,43,0.6)", backdropFilter: "blur(12px)" } : {}}
              >
                <Heart size={15} fill={fav ? "#ff8c94" : "none"} />
                {fav ? "Favorited" : "Add Favorite"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
                <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-4">Synopsis</h2>
                <div className="space-y-3">
                  {anime.synopsis.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-[#a9abaf] text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Episode list */}
            {episodes.length > 0 && (
              <div className="bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black font-headline text-[#f8f9fe]">
                    Episodes <span className="text-[#737679] font-medium text-base">({episodes.length})</span>
                  </h2>
                  {episodes.length > 12 && (
                    <button
                      onClick={() => setShowAllEps(!showAllEps)}
                      className="text-[#ff8c94] text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      {showAllEps ? "Show Less" : `View All ${episodes.length}`}
                      <ChevronRight size={14} className={`transition-transform ${showAllEps ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                  {displayedEps.map((ep, idx) => (
                    <EpisodeItem key={ep.slug} ep={ep} isLatest={idx === 0} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Info */}
          <div className="space-y-6">
            <div className="bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
              <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-4">Information</h2>
              <div className="space-y-4">
                {[
                  { label: "Status", val: anime.status },
                  { label: "Type", val: anime.type },
                  { label: "Year", val: anime.year },
                  { label: "Aired", val: anime.aired },
                  { label: "Studio", val: anime.studio },
                  { label: "Producer", val: anime.producers },
                  { label: "Duration", val: anime.duration },
                  { label: "Episodes", val: episodes.length ? `${episodes.length} eps` : undefined },
                  { label: "Score", val: anime.rating && !isNaN(Number(anime.rating)) ? `★ ${Number(anime.rating).toFixed(2)}` : undefined },
                ].filter((x) => x.val).map(({ label, val }) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="text-xs text-[#737679] uppercase tracking-widest font-bold shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-[#f8f9fe] font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
                <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((g) => (
                    <Link
                      key={g.slug}
                      to={`/genre/${g.slug}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#b08af7]/15 text-[#b08af7] border border-[#b08af7]/25 hover:bg-[#b08af7]/25 transition-colors"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {anime.related && anime.related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black font-headline text-[#f8f9fe]">You Might Also Like</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {anime.related.map((r) => (
                <RelatedCard key={r.slug} anime={r} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[#22262b] mt-24 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Home</Link>
              <Link to="/ongoing" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Ongoing</Link>
              <Link to="/genre" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Genre</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
