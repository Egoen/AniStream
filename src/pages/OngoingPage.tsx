import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { useOngoing, useGenres } from "@/hooks/useAnimeQuery";
import type { Anime } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// ── Anime Card ────────────────────────────────────────────────────────────────
function AnimeCard({ anime }: { anime: Anime }) {
  const isOngoing = anime.status?.toLowerCase() === "ongoing" || !anime.status;

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
        {/* Poster gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)" }} />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded text-white tracking-widest ${
          isOngoing ? "bg-rose-600" : "bg-slate-700"
        }`}>
          {isOngoing ? "ONGOING" : "COMPLETED"}
        </div>

        {/* Episode badge */}
        {anime.totalEpisode && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded backdrop-blur-md">
              EP {anime.totalEpisode}
            </span>
          </div>
        )}
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

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div>
      <div className="aspect-[3/4] rounded-xl bg-[#1c2024] animate-pulse mb-4" />
      <div className="h-4 bg-[#1c2024] rounded animate-pulse mb-2" />
      <div className="h-3 bg-[#1c2024] rounded animate-pulse w-2/3" />
    </div>
  );
}

// ── Filter Dropdown ────────────────────────────────────────────────────────────
function FilterDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#161a1e] rounded-lg group cursor-pointer hover:bg-[#1c2024] transition-colors select-none">
      <span className="text-xs font-bold text-[#a9abaf] group-hover:text-[#ff8c94] transition-colors">{label}:</span>
      <span className="text-sm font-semibold text-[#f8f9fe]">{value}</span>
      <ChevronDown size={14} className="text-[#a9abaf]" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OngoingPage() {
  const [page, setPage] = useState(1);
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data, isLoading, isError } = useOngoing(page);
  const { data: genres } = useGenres();

  // Merge pages as user loads more
  const displayed = page === 1 && allAnime.length === 0
    ? (data?.data ?? [])
    : allAnime.length > 0
    ? allAnime
    : (data?.data ?? []);

  // When new page data arrives, append it
  if (data?.data && page > 1 && loadingMore) {
    const existing = new Set(allAnime.map((a) => a.slug));
    const newItems = data.data.filter((a) => !existing.has(a.slug));
    if (newItems.length > 0) {
      setAllAnime((prev) => [...prev, ...newItems]);
      setLoadingMore(false);
    }
  }
  if (data?.data && page === 1 && allAnime.length === 0 && !loadingMore) {
    // first load — let "displayed" handle it via data directly
  }

  const handleLoadMore = () => {
    if (page === 1 && allAnime.length === 0 && data?.data) {
      setAllAnime(data.data);
    }
    setLoadingMore(true);
    setPage((p) => p + 1);
  };

  const hasMore = data?.hasNext ?? false;

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header + Filters ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">DISCOVER</span>
            <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">Ongoing Anime</h1>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 items-center bg-[#101417] p-2 rounded-xl">
            <FilterDropdown label="Genre" value={genres?.[0]?.name ? "All" : "All"} />
            <FilterDropdown label="Sort" value="Popularity" />
            <FilterDropdown label="Year" value="2025" />
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────────────────── */}
        {isError && (
          <div className="text-center py-24">
            <p className="text-[#a9abaf] text-lg mb-4">Gagal memuat data. Silakan coba lagi.</p>
            <button
              onClick={() => setPage(1)}
              className="px-6 py-2.5 bg-[#ff8c94] text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ── Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
          {isLoading && page === 1
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map((anime) => <AnimeCard key={anime.slug} anime={anime} />)
          }
          {/* Loading more skeletons */}
          {loadingMore && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
        </div>

        {/* ── Load More ────────────────────────────────────────────────── */}
        {!isLoading && !isError && (hasMore || page === 1) && displayed.length > 0 && (
          <div className="flex justify-center mt-16">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-12 py-4 rounded-xl font-black font-headline uppercase tracking-wider text-black flex items-center gap-2 hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#ff8c94]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  Loading...
                </>
              ) : "Load More"}
            </button>
          </div>
        )}

        {/* ── Empty ───────────────────────────────────────────────────── */}
        {!isLoading && !isError && displayed.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#a9abaf] text-lg">Tidak ada anime yang tersedia saat ini.</p>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-[#22262b] mt-24 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-black italic tracking-tighter text-[#f8f9fe] font-headline uppercase mb-3">
                ANIME STREAM
              </h3>
              <p className="text-[#a9abaf] text-sm leading-relaxed">
                The ultimate destination for cinematic anime experiences. Stream high-quality episodes and stay updated with the latest releases.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Legal</h4>
              <ul className="space-y-3">
                {([["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["About Us", "/about"]] as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Community</h4>
              <ul className="space-y-3">
                {["Discord Channel", "Twitter / X", "Facebook Group"].map((label) => (
                  <li key={label}>
                    <span className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors cursor-pointer">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:lastanteiku@gmail.com" className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">Contact Support</a></li>
                <li><Link to="/faq" className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">FAQ</Link></li>
                <li><Link to="/app-status" className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">App Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[#22262b]">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/genre" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Genre</Link>
              <Link to="/schedule" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Schedule</Link>
              <Link to="/favorites" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Favorites</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
