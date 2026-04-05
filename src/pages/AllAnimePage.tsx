import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useAllAnime } from "@/hooks/useAnimeQuery";

// ── Letter Nav ─────────────────────────────────────────────────────────────────
function LetterNav({
  letters,
  active,
  onSelect,
}: {
  letters: string[];
  active: string;
  onSelect: (l: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`w-10 h-10 rounded-xl text-sm font-black font-headline border transition-all flex items-center justify-center ${
          active === ""
            ? "text-black border-[#ff8c94]"
            : "bg-[#161a1e] border-[#22262b] text-[#a9abaf] hover:border-[#ff8c94]/40 hover:text-[#f8f9fe]"
        }`}
        style={active === "" ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
      >
        All
      </button>
      {letters.map((l) => (
        <button
          key={l}
          onClick={() => onSelect(l)}
          className={`w-10 h-10 rounded-xl text-sm font-black font-headline border transition-all flex items-center justify-center ${
            active === l
              ? "text-black border-[#ff8c94]"
              : "bg-[#161a1e] border-[#22262b] text-[#a9abaf] hover:border-[#ff8c94]/40 hover:text-[#f8f9fe]"
          }`}
          style={active === l ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ── Anime Row Item ─────────────────────────────────────────────────────────────
function AnimeItem({ slug, title }: { slug: string; title: string }) {
  return (
    <Link
      to={`/anime/${slug}`}
      className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#22262b] bg-[#101417] hover:bg-[#161a1e] hover:border-[#ff8c94]/25 transition-all group"
    >
      <span className="text-sm font-medium text-[#f8f9fe] group-hover:text-[#ff8c94] transition-colors line-clamp-1">
        {title}
      </span>
      <ChevronRight size={14} className="text-[#737679] group-hover:text-[#ff8c94] shrink-0 ml-3 transition-colors" />
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AllAnimePage() {
  const { data, isLoading, isError, refetch } = useAllAnime();
  const [activeLetter, setActiveLetter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const letters = useMemo(() => (data || []).map((g) => g.letter), [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      // Search mode: flatten all, filter by query, group by letter
      const allItems = data.flatMap((g) =>
        g.items.filter((a) => a.title.toLowerCase().includes(q)).map((a) => ({ ...a, letter: g.letter }))
      );
      // Re-group
      const grouped: Record<string, typeof allItems> = {};
      allItems.forEach((a) => {
        if (!grouped[a.letter]) grouped[a.letter] = [];
        grouped[a.letter].push(a);
      });
      return Object.entries(grouped).map(([letter, items]) => ({ letter, items }));
    }

    if (activeLetter) {
      return data.filter((g) => g.letter === activeLetter);
    }
    return data;
  }, [data, activeLetter, searchQuery]);

  const totalCount = useMemo(() => (data || []).reduce((sum, g) => sum + g.items.length, 0), [data]);
  const filteredCount = useMemo(() => filtered.reduce((sum, g) => sum + g.items.length, 0), [filtered]);

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-10">
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">LIBRARY</span>
          <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe] mb-2">All Anime</h1>
          <p className="text-[#a9abaf] text-sm">
            {isLoading ? "Loading complete library..." : `Complete A-Z database — ${totalCount.toLocaleString()} titles`}
          </p>
        </div>

        {/* ── Search + Stats ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Search */}
          <div
            className="flex items-center gap-3 flex-1 max-w-md px-4 py-3 rounded-xl border border-[#22262b] focus-within:border-[#ff8c94]/40 transition-all"
            style={{ background: "rgba(22,26,30,0.8)" }}
          >
            <Search size={16} className="text-[#a9abaf] shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveLetter(""); }}
              placeholder="Filter by title..."
              className="flex-1 bg-transparent text-[#f8f9fe] placeholder-[#737679] outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#737679] hover:text-[#f8f9fe] transition-colors">
                ×
              </button>
            )}
          </div>

          {/* Stats badge */}
          {!isLoading && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161a1e] border border-[#22262b]">
              <BookOpen size={14} className="text-[#ff8c94]" />
              <span className="text-sm font-bold text-[#f8f9fe]">
                {searchQuery ? `${filteredCount} results` : activeLetter ? `${filteredCount} titles` : `${totalCount.toLocaleString()} total`}
              </span>
            </div>
          )}
        </div>

        {/* ── Letter Filter ────────────────────────────────────────────── */}
        {!isLoading && !isError && !searchQuery && (
          <div className="mb-10">
            <LetterNav letters={letters} active={activeLetter} onSelect={setActiveLetter} />
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="animate-spin text-[#ff8c94]" />
            <p className="text-[#a9abaf] text-sm">Loading complete anime library...</p>
            <p className="text-[#737679] text-xs">This may take a moment</p>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {isError && (
          <div className="flex flex-col items-center py-24 gap-4">
            <AlertCircle size={36} className="text-rose-500" />
            <p className="text-[#a9abaf] text-lg">Failed to load the anime library.</p>
            <button
              onClick={refetch}
              className="px-6 py-2.5 text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Anime Groups ─────────────────────────────────────────────── */}
        {!isLoading && !isError && (
          <>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <Search size={36} className="text-[#45484c] mx-auto mb-4" />
                <p className="text-[#a9abaf] text-lg">No anime found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-[#ff8c94] text-sm font-bold hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {filtered.map((group) => (
                  <div key={group.letter}>
                    {/* Letter heading */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black font-headline text-lg text-black"
                        style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
                      >
                        {group.letter}
                      </div>
                      <div className="flex-1 h-px bg-[#22262b]" />
                      <span className="text-xs text-[#737679] font-bold shrink-0">
                        {group.items.length} title{group.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Anime grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {group.items.map((anime) => (
                        <AnimeItem key={anime.slug} slug={anime.slug} title={anime.title} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
