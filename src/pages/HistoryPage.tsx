import { Link } from "react-router-dom";
import { Clock, Trash2, Play, RotateCcw } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryPage() {
  const { history, clearHistory } = useAppStore();

  const grouped = history.reduce<Record<string, typeof history>>((acc, item) => {
    const now = new Date();
    const d = new Date(item.watchedAt);
    let label: string;
    if (d.toDateString() === now.toDateString()) label = "Today";
    else if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) label = "Yesterday";
    else label = d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-4xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">PERSONAL</span>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">History</h1>
              {history.length > 0 && (
                <span
                  className="text-lg font-black font-headline px-3 py-0.5 rounded-full"
                  style={{ background: "rgba(255,140,148,0.15)", color: "#ff8c94", border: "1px solid rgba(255,140,148,0.3)" }}
                >
                  {history.length}
                </span>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Clear all ${history.length} history entries?`)) clearHistory();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#22262b] text-sm font-bold text-[#737679] hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all min-h-[44px]"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {/* ── Empty State ────────────────────────────────────────────── */}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 px-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
              style={{ background: "radial-gradient(circle, rgba(255,140,148,0.1) 0%, transparent 70%)", border: "1px solid rgba(255,140,148,0.15)" }}
            >
              <Clock size={36} className="text-[#ff8c94]/40" />
            </div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-3 font-headline uppercase">Nothing Here Yet</span>
            <h2 className="text-2xl font-black font-headline text-[#f8f9fe] mb-3">No Watch History</h2>
            <p className="text-[#a9abaf] text-sm text-center max-w-sm leading-relaxed mb-8">
              Anime you watch will be tracked here automatically. Start watching to build your history.
            </p>
            <Link
              to="/ongoing"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
              style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
            >
              <Play size={14} fill="black" /> Browse Ongoing
            </Link>
          </div>
        )}

        {/* ── History Groups ────────────────────────────────────────── */}
        {history.length > 0 && (
          <div className="space-y-10">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                {/* Date label */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-black text-[#ff8c94] uppercase tracking-widest font-headline shrink-0">
                    {dateLabel}
                  </span>
                  <div className="flex-1 h-px bg-[#22262b]" />
                  <span className="text-xs text-[#737679] font-bold shrink-0">{items.length} episode{items.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Episode rows */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.episodeSlug}-${item.watchedAt}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-[#22262b] bg-[#101417] hover:border-[#ff8c94]/20 hover:bg-[#161a1e] transition-all group"
                    >
                      {/* Poster */}
                      <div className="w-14 h-[72px] rounded-xl overflow-hidden shrink-0 border border-[#22262b]">
                        <img
                          src={item.animePoster || FALLBACK}
                          alt={item.animeTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#f8f9fe] group-hover:text-[#ff8c94] transition-colors line-clamp-1 font-headline">
                          {item.animeTitle}
                        </p>
                        <p className="text-xs text-[#a9abaf] mt-0.5 line-clamp-1">{item.episodeTitle}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Clock size={9} className="text-[#737679]" />
                          <span className="text-[10px] text-[#737679] font-bold">{timeAgo(item.watchedAt)}</span>
                          <span className="w-1 h-1 rounded-full bg-[#45484c]" />
                          <span className="text-[10px] text-[#737679]">
                            {new Date(item.watchedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/watch/${item.episodeSlug}`}
                          title="Continue watching"
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[#ff8c94]/15 border border-[#ff8c94]/25 text-[#ff8c94] hover:bg-[#ff8c94]/25 hover:scale-105"
                        >
                          <RotateCcw size={14} />
                        </Link>
                        <Link
                          to={`/anime/${item.animeSlug}`}
                          title="View anime detail"
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[#161a1e] border border-[#22262b] text-[#a9abaf] hover:text-[#f8f9fe] hover:border-[#45484c]"
                        >
                          <Play size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-[#22262b] mt-24 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-black italic tracking-tighter text-[#f8f9fe] font-headline uppercase mb-3">ANIME STREAM</h3>
              <p className="text-[#a9abaf] text-sm leading-relaxed">
                The ultimate destination for cinematic anime experiences.
              </p>
            </div>
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Browse</h4>
              <ul className="space-y-3">
                {[["Ongoing", "/ongoing"], ["Completed", "/completed"], ["All Anime", "/all-anime"], ["Genre", "/genre"]].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Personal</h4>
              <ul className="space-y-3">
                {[["Favorites", "/favorites"], ["Watch History", "/history"], ["Schedule", "/schedule"]].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[#ff8c94] font-bold text-xs tracking-widest mb-4 uppercase">Legal</h4>
              <ul className="space-y-3">
                {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["About Us", "/about"]].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-[#a9abaf] hover:text-[#f8f9fe] text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-[#22262b]">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/favorites" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Favorites</Link>
              <Link to="/about" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">About</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
