import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X, Clock, ChevronRight, Play } from "lucide-react";
import { useSearch } from "@/hooks/useAnimeQuery";
import { useAppStore } from "@/stores/appStore";
import type { Anime } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// ── Result Card ───────────────────────────────────────────────────────────────
function ResultCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.slug}`} className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(255,140,148,0.2)]">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)" }} />

        {/* Status badge */}
        {anime.status && (
          <div className={`absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded text-white tracking-widest ${
            anime.status === "Ongoing" ? "bg-rose-600" : "bg-slate-700"
          }`}>
            {anime.status.toUpperCase()}
          </div>
        )}

        {/* Rating */}
        {anime.rating && !isNaN(Number(anime.rating)) && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-black text-amber-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-md">
              ★ {Number(anime.rating).toFixed(1)}
            </span>
          </div>
        )}

        {/* Play overlay */}
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
        {anime.genres?.slice(0, 2).map((g) => g.name).join(" • ") || anime.status || ""}
      </p>
    </Link>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div>
      <div className="aspect-[3/4] rounded-xl bg-[#1c2024] animate-pulse mb-3" />
      <div className="h-4 bg-[#1c2024] rounded animate-pulse mb-2" />
      <div className="h-3 bg-[#1c2024] rounded animate-pulse w-2/3" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useAppStore();
  const { data, isLoading } = useSearch(submitted);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const q = params.get("q") || "";
    setQuery(q);
    setSubmitted(q);
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const kw = query.trim();
    addRecentSearch(kw);
    setSubmitted(kw);
    setParams({ q: kw });
  };

  const applyRecent = (kw: string) => {
    setQuery(kw);
    setSubmitted(kw);
    setParams({ q: kw });
  };

  const clearQuery = () => {
    setQuery("");
    setSubmitted("");
    setParams({});
    inputRef.current?.focus();
  };

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">SEARCH</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe] mb-2">Find Anime</h1>
          <p className="text-[#a9abaf] text-sm">Search from thousands of anime titles.</p>
        </div>

        {/* ── Search Bar ──────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 rounded-2xl px-5 py-3.5 mb-10 border border-[#ff8c94]/20 focus-within:border-[#ff8c94]/50 transition-all"
          style={{ background: "rgba(22,26,30,0.8)", backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(255,140,148,0.08)" }}
        >
          <Search size={20} className="text-[#ff8c94] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime title... (e.g. Naruto, One Piece, Jujutsu Kaisen)"
            className="flex-1 bg-transparent text-[#f8f9fe] placeholder-[#737679] outline-none text-base"
          />
          {query && (
            <button type="button" onClick={clearQuery} className="text-[#737679] hover:text-[#f8f9fe] transition-colors p-1 shrink-0">
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-md shadow-[#ff8c94]/20 shrink-0"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            Search
          </button>
        </form>

        {/* ── Recent Searches ──────────────────────────────────────────── */}
        {!submitted && recentSearches.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black font-headline uppercase tracking-widest text-[#f8f9fe] flex items-center gap-2">
                <Clock size={14} className="text-[#ff8c94]" /> Recent Searches
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-[#a9abaf] hover:text-[#ff8c94] transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((kw) => (
                <button
                  key={kw}
                  onClick={() => applyRecent(kw)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#161a1e] border border-[#22262b] rounded-xl text-sm text-[#a9abaf] hover:text-[#f8f9fe] hover:border-[#ff8c94]/30 transition-all group"
                >
                  <Clock size={12} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors" />
                  {kw}
                  <ChevronRight size={12} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {submitted && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[#a9abaf]">
                  Results for <span className="text-[#ff8c94] font-bold">"{submitted}"</span>
                  {data && <span className="text-[#737679]"> — {data.length} anime found</span>}
                </p>
              </div>
              {query !== submitted && (
                <button
                  onClick={handleSubmit as unknown as React.MouseEventHandler}
                  className="text-xs text-[#ff8c94] font-bold hover:underline"
                >
                  Search "{query}"
                </button>
              )}
            </div>

            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {data && data.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                {data.map((anime) => <ResultCard key={anime.slug} anime={anime} />)}
              </div>
            )}

            {data && data.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 rounded-full border border-[#22262b] flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-[#45484c]" />
                </div>
                <h3 className="text-xl font-black font-headline text-[#f8f9fe] mb-2">No results found</h3>
                <p className="text-[#a9abaf] text-sm mb-1">No anime found for <span className="text-[#ff8c94]">"{submitted}"</span></p>
                <p className="text-[#737679] text-sm">Try a different keyword or check the spelling</p>
              </div>
            )}
          </>
        )}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {!submitted && !recentSearches.length && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-full border border-[#22262b] flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-[#45484c]" />
            </div>
            <h3 className="text-xl font-black font-headline text-[#f8f9fe] mb-2">Search Anime</h3>
            <p className="text-[#a9abaf] text-sm mb-6">Type an anime title to get started</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Naruto", "One Piece", "Demon Slayer", "Attack on Titan", "Jujutsu Kaisen", "Bleach"].map((kw) => (
                <button
                  key={kw}
                  onClick={() => applyRecent(kw)}
                  className="px-4 py-2 bg-[#161a1e] border border-[#22262b] rounded-xl text-sm text-[#a9abaf] hover:text-[#ff8c94] hover:border-[#ff8c94]/30 transition-all"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
      </main>
    </div>
  );
}
