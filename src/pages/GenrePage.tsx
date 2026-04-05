import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Play, Loader2 } from "lucide-react";
import { useGenres, useGenreAnime } from "@/hooks/useAnimeQuery";
import type { Genre, Anime } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// Genre color palettes for variety
const GENRE_COLORS = [
  { bg: "bg-rose-600/15", border: "border-rose-600/25", text: "text-rose-400", dot: "bg-rose-500" },
  { bg: "bg-violet-600/15", border: "border-violet-600/25", text: "text-violet-400", dot: "bg-violet-500" },
  { bg: "bg-amber-600/15", border: "border-amber-600/25", text: "text-amber-400", dot: "bg-amber-500" },
  { bg: "bg-emerald-600/15", border: "border-emerald-600/25", text: "text-emerald-400", dot: "bg-emerald-500" },
  { bg: "bg-sky-600/15", border: "border-sky-600/25", text: "text-sky-400", dot: "bg-sky-500" },
  { bg: "bg-pink-600/15", border: "border-pink-600/25", text: "text-pink-400", dot: "bg-pink-500" },
  { bg: "bg-orange-600/15", border: "border-orange-600/25", text: "text-orange-400", dot: "bg-orange-500" },
  { bg: "bg-cyan-600/15", border: "border-cyan-600/25", text: "text-cyan-400", dot: "bg-cyan-500" },
];

// ── Genre Grid ────────────────────────────────────────────────────────────────
function GenreGrid({ genres }: { genres: Genre[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {genres.map((g, i) => {
        const color = GENRE_COLORS[i % GENRE_COLORS.length];
        return (
          <Link
            key={g.slug}
            to={`/genre/${g.slug}`}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 group hover:scale-[1.02] cursor-pointer ${color.bg} ${color.border} hover:shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
              <span className={`text-sm font-bold font-headline ${color.text} group-hover:text-[#f8f9fe] transition-colors`}>
                {g.name}
              </span>
            </div>
            <ChevronRight size={14} className={`${color.text} group-hover:text-[#f8f9fe] transition-all group-hover:translate-x-0.5`} />
          </Link>
        );
      })}
    </div>
  );
}

// ── Genre Skeleton ────────────────────────────────────────────────────────────
function GenreSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="h-14 rounded-2xl bg-[#1c2024] animate-pulse" />
      ))}
    </div>
  );
}

// ── Anime Card (for genre results) ───────────────────────────────────────────
function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.slug}`} className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(255,140,148,0.2)]">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)" }} />

        <div className={`absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded text-white tracking-widest ${
          anime.status === "Ongoing" ? "bg-rose-600" : "bg-slate-700"
        }`}>
          {anime.status?.toUpperCase() || "ANIME"}
        </div>

        {anime.totalEpisode && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded backdrop-blur-md">
              EP {anime.totalEpisode}
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#ff8c94]/90 flex items-center justify-center shadow-lg">
            <Play size={18} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
      </div>

      <h3 className="font-headline font-bold text-[#f8f9fe] line-clamp-1 group-hover:text-[#ff8c94] transition-colors text-sm">
        {anime.title}
      </h3>
      <p className="text-xs text-[#a9abaf] mt-1 line-clamp-1">
        {anime.genres?.slice(0, 2).map((g) => g.name).join(" • ") || anime.releaseDay || ""}
      </p>
    </Link>
  );
}

// ── Anime Card Skeleton ───────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] rounded-xl bg-[#1c2024] animate-pulse mb-4" />
      <div className="h-4 bg-[#1c2024] rounded animate-pulse mb-2" />
      <div className="h-3 bg-[#1c2024] rounded animate-pulse w-2/3" />
    </div>
  );
}

// ── Genre Anime List ──────────────────────────────────────────────────────────
function GenreAnimeList({ slug, genreName }: { slug: string; genreName: string }) {
  const [page, setPage] = useState(1);
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { data, isLoading, isError } = useGenreAnime(slug, page);

  const displayed =
    page === 1 && allAnime.length === 0
      ? data?.data ?? []
      : allAnime.length > 0
      ? allAnime
      : data?.data ?? [];

  if (data?.data && page > 1 && loadingMore) {
    const existing = new Set(allAnime.map((a) => a.slug));
    const newItems = data.data.filter((a) => !existing.has(a.slug));
    if (newItems.length > 0) {
      setAllAnime((prev) => [...prev, ...newItems]);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => {
    if (page === 1 && allAnime.length === 0 && data?.data) setAllAnime(data.data);
    setLoadingMore(true);
    setPage((p) => p + 1);
  };

  if (isError) return (
    <div className="text-center py-24">
      <p className="text-[#a9abaf] text-lg mb-4">Gagal memuat data genre.</p>
      <button onClick={() => setPage(1)} className="px-6 py-2.5 bg-[#ff8c94] text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
        Coba Lagi
      </button>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
        {isLoading && page === 1
          ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
          : displayed.map((anime) => <AnimeCard key={anime.slug} anime={anime} />)
        }
        {loadingMore && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={`m-${i}`} />)}
      </div>

      {!isLoading && !isError && displayed.length === 0 && (
        <div className="text-center py-24">
          <p className="text-[#a9abaf] text-lg">No anime found for genre "{genreName}".</p>
        </div>
      )}

      {!isLoading && !isError && (data?.hasNext || page === 1) && displayed.length > 0 && (
        <div className="flex justify-center mt-16">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-12 py-4 rounded-xl font-black font-headline uppercase tracking-wider text-black flex items-center gap-2 hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#ff8c94]/20 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            {loadingMore ? <><Loader2 size={16} className="animate-spin" />Loading...</> : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GenrePage() {
  const { slug } = useParams<{ slug?: string }>();
  const { data: genres, isLoading: genresLoading } = useGenres();

  const genreName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  // Find genre display name from genres list
  const genreDisplay = genres?.find((g) => g.slug === slug)?.name || genreName;

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-10">
          {slug && (
            <Link to="/genre" className="flex items-center gap-1.5 text-[#a9abaf] hover:text-[#ff8c94] text-xs font-bold uppercase tracking-widest transition-colors mb-3 w-fit">
              <ChevronRight size={12} className="rotate-180" /> All Genres
            </Link>
          )}
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">
            {slug ? "GENRE" : "BROWSE"}
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">
            {slug ? genreDisplay : "All Genres"}
          </h1>
          <p className="text-[#a9abaf] text-sm mt-2">
            {slug ? `Browse all anime in the ${genreDisplay} genre.` : "Explore anime by genre category."}
          </p>
        </div>

        {/* ── Genre list or Anime results ───────────────────────────── */}
        {!slug ? (
          genresLoading
            ? <GenreSkeleton />
            : <GenreGrid genres={genres || []} />
        ) : (
          <>
            {/* Genre breadcrumb pills */}
            {genres && genres.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-10 -mx-6 px-6 md:-mx-8 md:px-8">
                {genres.slice(0, 16).map((g) => (
                  <Link
                    key={g.slug}
                    to={`/genre/${g.slug}`}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      g.slug === slug
                        ? "text-black border-[#ff8c94]"
                        : "bg-[#161a1e] border-[#22262b] text-[#a9abaf] hover:border-[#ff8c94]/30 hover:text-[#f8f9fe]"
                    }`}
                    style={g.slug === slug ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
            <GenreAnimeList slug={slug} genreName={genreDisplay} />
          </>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-[#22262b] mt-24 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Home</Link>
              <Link to="/ongoing" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Ongoing</Link>
              <Link to="/schedule" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Schedule</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
