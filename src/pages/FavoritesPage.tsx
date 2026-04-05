import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Play, Trash2, ChevronDown, SortAsc } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import type { FavoriteItem } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

type SortMode = "newest" | "oldest" | "title";

// ── Favorite Card ─────────────────────────────────────────────────────────────
function FavoriteCard({ item, onRemove }: { item: FavoriteItem; onRemove: (slug: string) => void }) {
  return (
    <div className="group cursor-pointer relative">
      {/* Poster */}
      <Link to={`/anime/${item.slug}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(255,140,148,0.2)]">
          <img
            src={item.poster || FALLBACK}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)" }}
          />

          {/* Status badge */}
          <div className={`absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded text-white tracking-widest ${
            item.status === "Ongoing" ? "bg-rose-600" : "bg-slate-700"
          }`}>
            {item.status === "Ongoing" ? "ONGOING" : item.status ? "COMPLETED" : "SAVED"}
          </div>

          {/* Remove button — appears on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.slug);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-white/10 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/80 hover:text-white hover:border-rose-500/40 hover:scale-110"
            title="Remove from favorites"
          >
            <Trash2 size={12} />
          </button>

          {/* Date added badge at bottom */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded backdrop-blur-md">
              {new Date(item.addedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
            </span>
          </div>

          {/* Play overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#ff8c94] flex items-center justify-center shadow-2xl shadow-[#ff8c94]/40">
              <Play size={16} fill="black" className="text-black ml-0.5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Title + genres */}
      <Link to={`/anime/${item.slug}`}>
        <h3 className="font-headline font-bold text-[#f8f9fe] line-clamp-1 group-hover:text-[#ff8c94] transition-colors text-sm">
          {item.title}
        </h3>
        <p className="text-xs text-[#a9abaf] mt-1 line-clamp-1">
          {item.genres?.slice(0, 2).map((g) => g.name).join(" • ") || "Anime"}
        </p>
      </Link>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-6">
      {/* Illustration */}
      <div className="relative mb-8">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, rgba(255,140,148,0.15) 0%, transparent 70%)" }}
        >
          <div
            className="w-20 h-20 rounded-full border border-[#ff8c94]/20 flex items-center justify-center"
            style={{ background: "rgba(255,140,148,0.08)" }}
          >
            <Heart size={36} className="text-[#ff8c94]/40" />
          </div>
        </div>
        {/* Floating dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff8c94]/30 animate-pulse" />
        <div className="absolute bottom-2 -left-2 w-2 h-2 rounded-full bg-[#ff7481]/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-3 font-headline uppercase">Collection Empty</span>
      <h2 className="text-2xl font-black font-headline text-[#f8f9fe] mb-3">No Favorites Yet</h2>
      <p className="text-[#a9abaf] text-sm text-center max-w-sm leading-relaxed mb-8">
        Start building your collection. Open any anime detail page and hit the heart button to save it here.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/ongoing"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
          style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
        >
          <Play size={14} fill="black" /> Browse Ongoing
        </Link>
        <Link
          to="/genre"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#22262b] font-bold font-headline uppercase tracking-wider text-sm text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#161a1e] transition-all"
        >
          Browse by Genre
        </Link>
      </div>
    </div>
  );
}

// ── Sort Dropdown ─────────────────────────────────────────────────────────────
function SortButton({ mode, onChange }: { mode: SortMode; onChange: (m: SortMode) => void }) {
  const labels: Record<SortMode, string> = {
    newest: "Newest Added",
    oldest: "Oldest Added",
    title: "Title A–Z",
  };
  const options: SortMode[] = ["newest", "oldest", "title"];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-[#101417] rounded-xl border border-[#22262b] hover:border-[#ff8c94]/30 transition-all min-h-[44px]">
        <SortAsc size={13} className="text-[#ff8c94]" />
        <span className="text-sm font-bold text-[#f8f9fe]">{labels[mode]}</span>
        <ChevronDown size={13} className="text-[#737679]" />
      </button>
      {/* Dropdown on group-hover */}
      <div
        className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[#22262b] overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20"
        style={{ background: "rgba(11,14,17,0.97)", backdropFilter: "blur(16px)" }}
      >
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors border-b border-[#22262b] last:border-0 ${
              mode === opt ? "text-[#ff8c94] bg-[#ff8c94]/8" : "text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#161a1e]"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FavoritesPage() {
  const { favorites, removeFavorite } = useAppStore();
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const sorted = useMemo(() => {
    const copy = [...favorites];
    if (sortMode === "newest") return copy.sort((a, b) => b.addedAt - a.addedAt);
    if (sortMode === "oldest") return copy.sort((a, b) => a.addedAt - b.addedAt);
    if (sortMode === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy;
  }, [favorites, sortMode]);

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">COLLECTION</span>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">
                Favorites
              </h1>
              {favorites.length > 0 && (
                <span
                  className="text-lg font-black font-headline px-3 py-0.5 rounded-full"
                  style={{ background: "rgba(255,140,148,0.15)", color: "#ff8c94", border: "1px solid rgba(255,140,148,0.3)" }}
                >
                  {favorites.length}
                </span>
              )}
            </div>
          </div>

          {/* Sort control */}
          {favorites.length > 1 && (
            <SortButton mode={sortMode} onChange={setSortMode} />
          )}
        </div>

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {favorites.length === 0 && <EmptyState />}

        {/* ── Grid ────────────────────────────────────────────────────── */}
        {favorites.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
              {sorted.map((item) => (
                <FavoriteCard key={item.slug} item={item} onRemove={removeFavorite} />
              ))}
            </div>

            {/* Clear all */}
            <div className="flex justify-center mt-16">
              <button
                onClick={() => {
                  if (window.confirm(`Remove all ${favorites.length} favorites?`)) {
                    favorites.forEach((f) => removeFavorite(f.slug));
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#22262b] text-sm font-bold text-[#737679] hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all"
              >
                <Trash2 size={14} /> Clear All Favorites
              </button>
            </div>
          </>
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
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Quick Links</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "About Us"].map((label) => (
                  <li key={label}>
                    <span className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors cursor-pointer">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Browse */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Browse</h4>
              <ul className="space-y-3">
                {[
                  { label: "Ongoing Anime", to: "/ongoing" },
                  { label: "Completed Anime", to: "/completed" },
                  { label: "All Anime (A-Z)", to: "/all-anime" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personal */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Personal</h4>
              <ul className="space-y-3">
                {[
                  { label: "Favorites", to: "/favorites" },
                  { label: "Watch History", to: "/history" },
                  { label: "Schedule", to: "/schedule" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[#22262b]">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/genre" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Genre</Link>
              <Link to="/schedule" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Schedule</Link>
              <Link to="/ongoing" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Ongoing</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
