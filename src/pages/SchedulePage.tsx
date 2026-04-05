import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Play, ChevronRight } from "lucide-react";
import { useSchedule } from "@/hooks/useAnimeQuery";
import type { ScheduleDay } from "@/types/anime";

const FALLBACK = "https://via.placeholder.com/100x140/111118/ff8c94?text=No";

const DAYS_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAYS_EN: Record<string, string> = {
  Senin: "Monday", Selasa: "Tuesday", Rabu: "Wednesday",
  Kamis: "Thursday", Jumat: "Friday", Sabtu: "Saturday", Minggu: "Sunday",
};

const todayName = () => {
  const names = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return names[new Date().getDay()];
};

// ── Schedule Card ─────────────────────────────────────────────────────────────
function ScheduleCard({ anime }: { anime: { slug: string; title: string; poster: string } }) {
  return (
    <Link
      to={`/anime/${anime.slug}`}
      className="flex items-center justify-between p-4 rounded-2xl border border-[#22262b] bg-[#101417] hover:bg-[#161a1e] hover:border-[#ff8c94]/25 transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-16 rounded-xl overflow-hidden bg-[#1c2024] shrink-0">
          <img
            src={anime.poster || FALLBACK}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#f8f9fe] line-clamp-2 leading-tight group-hover:text-[#ff8c94] transition-colors">
            {anime.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-bold text-rose-400 bg-rose-600/15 border border-rose-600/25 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Ongoing
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <Bell size={15} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors" />
        <ChevronRight size={14} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors" />
      </div>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#22262b] bg-[#101417]">
      <div className="w-12 h-16 rounded-xl bg-[#1c2024] animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#1c2024] rounded animate-pulse" />
        <div className="h-3 bg-[#1c2024] rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const { data: schedule, isLoading, isError, refetch } = useSchedule();
  const today = todayName();
  const [activeDay, setActiveDay] = useState<string>("");

  const sortedSchedule: ScheduleDay[] = schedule
    ? [...schedule].sort((a, b) => {
        const ai = DAYS_ORDER.indexOf(a.day);
        const bi = DAYS_ORDER.indexOf(b.day);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  const resolvedDay = activeDay || today || sortedSchedule[0]?.day || "";
  const activeSchedule = sortedSchedule.find((d) => d.day === resolvedDay);

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-10">
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">AIRING</span>
          <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">Release Schedule</h1>
          <p className="text-[#a9abaf] text-sm mt-2">Weekly anime airing schedule — never miss an episode.</p>
        </div>

        {/* ── Error ───────────────────────────────────────────────────── */}
        {isError && (
          <div className="text-center py-24">
            <p className="text-[#a9abaf] text-lg mb-4">Gagal memuat jadwal.</p>
            <button onClick={refetch} className="px-6 py-2.5 bg-[#ff8c94] text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
              Coba Lagi
            </button>
          </div>
        )}

        {/* ── Content ─────────────────────────────────────────────────── */}
        {!isError && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Day picker — Left column */}
            <div className="lg:col-span-3">
              <div className="bg-[#101417] rounded-3xl p-6 border border-[#22262b] lg:sticky lg:top-24">
                <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-5 flex items-center gap-2">
                  Schedule
                </h2>

                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-12 bg-[#1c2024] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sortedSchedule.map((d) => {
                      const isActive = d.day === resolvedDay;
                      const isToday = d.day === today;
                      return (
                        <button
                          key={d.day}
                          onClick={() => setActiveDay(d.day)}
                          className={`flex justify-between items-center px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                            isActive
                              ? "text-black"
                              : "bg-[#1c2024] text-[#a9abaf] hover:bg-[#22262b] hover:text-[#f8f9fe]"
                          }`}
                          style={isActive ? { background: "linear-gradient(135deg, #ff8c94, #ff7481)" } : {}}
                        >
                          <div className="flex items-center gap-2">
                            <span>{DAYS_EN[d.day] || d.day}</span>
                            {isToday && !isActive && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#ff8c94]/20 text-[#ff8c94] uppercase">Today</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isActive ? "text-black/60" : "text-[#737679]"}`}>
                              {d.animes.length}
                            </span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Anime list — Right column */}
            <div className="lg:col-span-9">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : activeSchedule ? (
                <>
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black font-headline text-[#f8f9fe]">
                        {DAYS_EN[activeSchedule.day] || activeSchedule.day}
                        {activeSchedule.day === today && (
                          <span className="ml-3 text-sm font-bold px-2.5 py-1 rounded-full text-black align-middle"
                            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}>
                            Today
                          </span>
                        )}
                      </h2>
                      <p className="text-[#737679] text-sm mt-1">
                        {activeSchedule.animes.length} anime airing on {DAYS_EN[activeSchedule.day] || activeSchedule.day}
                      </p>
                    </div>
                    <Link
                      to="/ongoing"
                      className="flex items-center gap-1 text-[#ff8c94] text-sm font-bold hover:underline"
                    >
                      View All Ongoing <ChevronRight size={14} />
                    </Link>
                  </div>

                  {/* Cards grid */}
                  {activeSchedule.animes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSchedule.animes.map((anime) => (
                        <ScheduleCard key={anime.slug} anime={anime} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center rounded-2xl border border-[#22262b] bg-[#101417]">
                      <Play size={32} className="text-[#45484c] mx-auto mb-3" />
                      <p className="text-[#a9abaf] font-medium">No anime airing on this day.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center rounded-2xl border border-[#22262b] bg-[#101417]">
                  <Bell size={32} className="text-[#45484c] mx-auto mb-3" />
                  <p className="text-[#a9abaf]">Select a day to view the schedule.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── This Week Summary ────────────────────────────────────────── */}
        {!isLoading && !isError && sortedSchedule.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black font-headline text-[#f8f9fe] mb-6">This Week at a Glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {sortedSchedule.map((d) => {
                const isActive = d.day === resolvedDay;
                const isToday = d.day === today;
                return (
                  <button
                    key={d.day}
                    onClick={() => { setActiveDay(d.day); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] cursor-pointer ${
                      isActive
                        ? "border-[#ff8c94]/40 bg-[#ff8c94]/10"
                        : isToday
                        ? "border-[#ff8c94]/20 bg-[#101417]"
                        : "border-[#22262b] bg-[#101417] hover:border-[#45484c]"
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? "text-[#ff8c94]" : isToday ? "text-[#ff8c94]/60" : "text-[#737679]"}`}>
                      {(DAYS_EN[d.day] || d.day).slice(0, 3).toUpperCase()}
                    </p>
                    <p className={`text-2xl font-black font-headline ${isActive ? "text-[#ff8c94]" : "text-[#f8f9fe]"}`}>
                      {d.animes.length}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-[#a9abaf]" : "text-[#737679]"}`}>anime</p>
                    {isToday && (
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#ff8c94] mx-auto animate-pulse" />
                    )}
                  </button>
                );
              })}
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
              <Link to="/completed" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Completed</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
