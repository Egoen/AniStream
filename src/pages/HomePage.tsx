import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHome, useSchedule, useCompleted } from "@/hooks/useAnimeQuery";
import { useAppStore } from "@/stores/appStore";
import { Heart, Play, Star, Bell, ChevronRight, Clock } from "lucide-react";
import type { Anime, ScheduleDay, HistoryItem } from "@/types/anime";
import heroBanner from "@/assets/hero-banner.jpg";

const DAYS_ID: Record<string, string> = {
  Senin: "Monday", Selasa: "Tuesday", Rabu: "Wednesday",
  Kamis: "Thursday", Jumat: "Friday", Sabtu: "Saturday", Minggu: "Sunday",
};
const FALLBACK = "https://via.placeholder.com/300x420/111118/7c3aed?text=No+Image";

// ── Continue Watching Card ────────────────────────────────────────────────────
function ContinueWatchingCard({ item }: { item: HistoryItem }) {
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Link
      to={`/watch/${item.episodeSlug}`}
      className="group flex-none w-40 sm:w-44"
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_24px_rgba(255,140,148,0.25)]">
        <img
          src={item.animePoster || FALLBACK}
          alt={item.animeTitle}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 55%)" }} />

        {/* Rose play button — center on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-xl shadow-[#ff8c94]/30"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}>
            <Play size={16} fill="black" className="text-black ml-0.5" />
          </div>
        </div>

        {/* Time badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
          <Clock size={9} className="text-[#ff8c94]" />
          <span className="text-[9px] font-bold text-[#ff8c94]">{timeAgo(item.watchedAt)}</span>
        </div>
      </div>

      {/* Anime title + episode */}
      <h4 className="font-bold text-[#f8f9fe] text-xs line-clamp-1 group-hover:text-[#ff8c94] transition-colors mb-0.5">
        {item.animeTitle}
      </h4>
      <p className="text-[10px] text-[#737679] line-clamp-1">
        {item.episodeTitle}
      </p>
    </Link>
  );
}

// ── Continue Watching Rail ─────────────────────────────────────────────────────
function ContinueWatchingRail({ items }: { items: HistoryItem[] }) {
  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[#ff8c94] font-bold tracking-widest text-[10px] mb-1 block font-headline uppercase">Continue Watching</span>
          <h2 className="text-2xl font-black font-headline tracking-tight text-[#f8f9fe]">
            Resume Where You Left Off
          </h2>
        </div>
        <Link
          to="/history"
          className="text-[#ff8c94] font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0"
        >
          History <ChevronRight size={14} />
        </Link>
      </div>

      {/* Scroll rail with gradient fade edges */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0b0e11, transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #0b0e11, transparent)" }} />

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {items.map((item) => (
            <div key={item.episodeSlug} style={{ scrollSnapAlign: "start" }}>
              <ContinueWatchingCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Ongoing Card ──────────────────────────────────────────────────────────────
function OngoingCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.slug}`} className="group cursor-pointer flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#ff8c94]/20">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
        {anime.totalEpisode && (
          <div className="absolute bottom-3 left-3 bg-[#ff8c94] text-black text-[10px] font-black px-2 py-1 rounded">
            EP {anime.totalEpisode}
          </div>
        )}
      </div>
      <h3 className="font-bold text-[#f8f9fe] group-hover:text-[#ff8c94] transition-colors line-clamp-1 text-sm">
        {anime.title}
      </h3>
      <p className="text-[#a9abaf] text-xs mt-1 line-clamp-1">
        {anime.duration && `${anime.duration} • `}{anime.genres?.[0]?.name || anime.releaseDay || ""}
      </p>
    </Link>
  );
}

// ── Completed Card ────────────────────────────────────────────────────────────
function CompletedCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.slug}`} className="group cursor-pointer flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#ff8c94]/20">
        <img
          src={anime.poster || FALLBACK}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-3 left-3 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded">
          FINAL EP
        </div>
      </div>
      <h3 className="font-bold text-[#f8f9fe] group-hover:text-[#ff8c94] transition-colors line-clamp-1 text-sm">
        {anime.title}
      </h3>
      <p className="text-[#a9abaf] text-xs mt-1">
        {anime.totalEpisode ? `${anime.totalEpisode} Episodes` : ""}
        {anime.genres?.[0]?.name ? ` • ${anime.genres[0].name}` : ""}
      </p>
    </Link>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonPosterCard() {
  return (
    <div className="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]">
      <div className="aspect-[3/4] rounded-xl bg-[#1c2024] animate-pulse mb-3" />
      <div className="h-4 bg-[#1c2024] rounded animate-pulse mb-1" />
      <div className="h-3 bg-[#1c2024] rounded animate-pulse w-2/3" />
    </div>
  );
}

// ── Schedule Row ──────────────────────────────────────────────────────────────
function ScheduleAnimeRow({ item }: { item: { slug: string; title: string; poster: string } }) {
  return (
    <Link
      to={`/anime/${item.slug}`}
      className="p-4 rounded-2xl bg-[#1c2024] flex items-center justify-between group hover:bg-[#22262b] transition-colors cursor-pointer border border-[#45484c]/10"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#0b0e11] overflow-hidden shrink-0">
          <img
            src={item.poster || FALLBACK}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          />
        </div>
        <h4 className="font-bold text-[#f8f9fe] text-sm line-clamp-1">{item.title}</h4>
      </div>
      <Bell size={16} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors shrink-0 ml-2" />
    </Link>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ anime }: { anime: Anime | null }) {
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();
  const navigate = useNavigate();
  const fav = anime ? isFavorite(anime.slug) : false;

  const handleFav = () => {
    if (!anime) return;
    if (fav) removeFavorite(anime.slug);
    else addFavorite({ slug: anime.slug, title: anime.title, poster: anime.poster, status: anime.status, genres: anime.genres, addedAt: Date.now() });
  };

  const firstEpHref = anime ? `/anime/${anime.slug}` : "/";

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-16 pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src={anime?.poster || heroBanner}
          alt={anime?.title || "AniStream"}
          className="w-full h-full object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-[#0b0e11]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e11] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {anime?.rating && (
            <div className="flex items-center text-[#ff8c94] font-bold">
              <Star size={16} fill="#ff8c94" className="mr-1" />
              <span className="font-headline">{anime.rating}</span>
            </div>
          )}
          {anime?.rating && <span className="w-1 h-1 rounded-full bg-[#45484c]" />}
          <div className="flex gap-2 flex-wrap">
            {anime?.genres?.slice(0, 3).map((g) => (
              <span key={g.slug} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#b08af7]/20 text-[#b08af7] border border-[#b08af7]/30">
                {g.name}
              </span>
            ))}
            {!anime?.genres?.length && ["Action", "Fantasy", "Adventure"].map((g) => (
              <span key={g} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#b08af7]/20 text-[#b08af7] border border-[#b08af7]/30">{g}</span>
            ))}
          </div>
        </div>

        {/* Title */}
        {anime ? (
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-[#f8f9fe] mb-5 leading-none">
            {anime.title.split(" ").length > 1 ? (
              <>
                {anime.title.split(" ").slice(0, Math.ceil(anime.title.split(" ").length / 2)).join(" ")}<br />
                <span className="text-[#ff8c94]">{anime.title.split(" ").slice(Math.ceil(anime.title.split(" ").length / 2)).join(" ")}</span>
              </>
            ) : (
              <span className="text-[#ff8c94]">{anime.title}</span>
            )}
          </h1>
        ) : (
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-[#f8f9fe] mb-5 leading-none">
            ANIME<br /><span className="text-[#ff8c94]">STREAM</span>
          </h1>
        )}

        <p className="text-[#a9abaf] text-base leading-relaxed mb-8 max-w-lg">
          {anime?.synopsis?.slice(0, 160) + (anime?.synopsis && anime.synopsis.length > 160 ? "..." : "") ||
            "Streaming anime subtitle Indonesia terlengkap. Tonton anime ongoing dan completed favoritmu kapan saja."}
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(firstEpHref)}
            className="px-7 py-3.5 rounded-xl font-black font-headline uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#ff8c94]/20 text-sm"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            <Play size={16} fill="black" className="text-black" />
            <span className="text-black">Watch Now</span>
          </button>
          <button
            onClick={handleFav}
            className="px-7 py-3.5 rounded-xl border border-[#45484c]/40 text-[#f8f9fe] font-bold font-headline uppercase tracking-wider flex items-center gap-2 hover:bg-[#1c2024] transition-all text-sm"
            style={{ background: "rgba(34, 38, 43, 0.6)", backdropFilter: "blur(24px)" }}
          >
            <Heart size={16} fill={fav ? "#ff8c94" : "none"} className={fav ? "text-[#ff8c94]" : ""} />
            {fav ? "Favorited" : "Add Favorite"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: home, isLoading: homeLoading } = useHome();
  const { data: schedule, isLoading: schedLoading } = useSchedule();
  const { data: completedData, isLoading: completedLoading } = useCompleted(1);
  const { history } = useAppStore();
  const recentHistory = history.slice(0, 6);

  const ongoing = home?.ongoing?.slice(0, 10) ?? [];
  const completed = completedData?.data?.slice(0, 10) ?? [];
  const featured = ongoing[0] ?? null;

  // Schedule state
  const days = schedule ?? [];
  const todayId = new Date().toLocaleDateString("id-ID", { weekday: "long" });
  const defaultDay = days.find(d => d.day === todayId)?.day ?? days[0]?.day ?? "";
  const [activeDay, setActiveDay] = useState<string>("");
  const resolvedDay = activeDay || defaultDay;
  const activeSchedule: ScheduleDay | undefined = days.find((d) => d.day === resolvedDay);

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      {/* Hero */}
      <HeroSection anime={featured} />

      {/* Content */}
      <main className="relative z-10 px-6 md:px-16 space-y-24 -mt-20">

        {/* ── Continue Watching ───────────────────────────────────────── */}
        {recentHistory.length > 0 && (
          <ContinueWatchingRail items={recentHistory} />
        )}

        {/* ── Ongoing Anime ───────────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black font-headline tracking-tight text-[#f8f9fe]">Ongoing Anime</h2>
              <p className="text-[#a9abaf] text-sm mt-1">Catch the latest episodes as they air.</p>
            </div>
            <Link to="/ongoing" className="text-[#ff8c94] font-bold text-sm uppercase tracking-widest hover:underline flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {homeLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonPosterCard key={i} />)
              : ongoing.slice(0, 10).map((a) => <OngoingCard key={a.slug} anime={a} />)
            }
          </div>
        </section>

        {/* ── Schedule Today ──────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Day picker */}
          <div className="lg:col-span-4 bg-[#101417] p-8 rounded-3xl">
            <h2 className="text-3xl font-black font-headline tracking-tight text-[#f8f9fe] mb-6">Schedule Today</h2>
            {schedLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-12 bg-[#1c2024] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {days.map((d) => {
                  const isActive = d.day === resolvedDay;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setActiveDay(d.day)}
                      className={`flex justify-between items-center px-4 py-3 rounded-xl font-bold transition-all text-left ${
                        isActive
                          ? "bg-[#ff8c94] text-black"
                          : "bg-[#1c2024] text-[#a9abaf] hover:bg-[#22262b]"
                      }`}
                    >
                      <span>{DAYS_ID[d.day] || d.day}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-black/40 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Anime slots */}
          <div className="lg:col-span-8">
            {schedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#1c2024] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : activeSchedule ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSchedule.animes.slice(0, 9).map((a) => (
                  <ScheduleAnimeRow key={a.slug} item={a} />
                ))}
                {activeSchedule.animes.length > 9 && (
                  <Link
                    to="/schedule"
                    className="p-4 rounded-2xl bg-[#1c2024] flex items-center justify-center font-bold text-[#ff8c94] hover:bg-[#22262b] transition-colors border border-[#45484c]/10 text-sm"
                  >
                    View Full Schedule <ChevronRight size={16} className="ml-1" />
                  </Link>
                )}
                {activeSchedule.animes.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-[#a9abaf] text-sm">
                    Tidak ada anime yang tayang hari ini.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-[#a9abaf] text-sm">Pilih hari untuk melihat jadwal.</div>
            )}
          </div>
        </section>

        {/* ── Recently Completed ──────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black font-headline tracking-tight text-[#f8f9fe]">Recently Completed</h2>
              <p className="text-[#a9abaf] text-sm mt-1">Binge-watch full series from start to finish.</p>
            </div>
            <Link to="/completed" className="text-[#ff8c94] font-bold text-sm uppercase tracking-widest hover:underline flex items-center">
              Explore <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {completedLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonPosterCard key={i} />)
              : completed.slice(0, 10).map((a) => <CompletedCard key={a.slug} anime={a} />)
            }
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-[#22262b] pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-black italic tracking-tighter text-[#f8f9fe] font-headline uppercase mb-3">ANIME STREAM</h3>
              <p className="text-[#a9abaf] text-sm leading-relaxed">
                Elevating your streaming experience with cinematic quality and an editorial touch.
              </p>
            </div>
            {/* Discovery */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-sm mb-4">Discovery</h4>
              <ul className="space-y-2.5">
                {[["New Releases", "/ongoing"], ["Popular This Week", "/ongoing"], ["Top Rated", "/completed"], ["Genre List", "/genre"]].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Support */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-sm mb-4">Support</h4>
              <ul className="space-y-2.5">
                {["Contact Support", "FAQ", "App Status", "Feature Request"].map((label) => (
                  <li key={label}><span className="text-[#a9abaf] text-sm">{label}</span></li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-[#ff8c94] font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[[
                  "Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["About Us", "/about"]].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-[#22262b]">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
