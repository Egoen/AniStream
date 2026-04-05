import { Link } from "react-router-dom";
import { Clock, Trash2, Play, RotateCcw } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const FALLBACK = "https://via.placeholder.com/300x420/111118/7c3aed?text=No+Image";

export default function HistoryPage() {
  const { history, clearHistory } = useAppStore();

  const grouped = history.reduce<Record<string, typeof history>>((acc, item) => {
    const date = new Date(item.watchedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-brand" />
        <h1 className="text-xl font-bold text-text-base">Riwayat Tontonan</h1>
        <span className="ml-2 text-sm text-text-subtle">({history.length})</span>
        <div className="ml-2 h-px flex-1 bg-brand/20" />
        {history.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors min-h-[36px]">
            <Trash2 size={13} /> Hapus Semua
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-24 text-center">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-text-base font-semibold mb-2">Belum ada riwayat</h3>
          <p className="text-text-muted text-sm mb-6">Tonton anime apa saja untuk mulai mencatat riwayat</p>
          <Link to="/" className="px-5 py-2.5 bg-brand hover:bg-brand-light rounded-xl text-sm font-semibold text-white transition-colors">
            Mulai Nonton
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-subtle" /> {date} <span className="h-px flex-1 bg-subtle" />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                  <div key={`${item.episodeSlug}-${item.watchedAt}`} className="flex items-center gap-3 p-3 bg-bg-card border border-subtle rounded-xl hover:border-brand/20 transition-colors group">
                    <img src={item.animePoster || FALLBACK} alt={item.animeTitle} className="w-12 h-16 object-cover rounded-lg shrink-0" onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-base line-clamp-1">{item.animeTitle}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{item.episodeTitle}</p>
                      <p className="text-[10px] text-text-subtle mt-1">
                        {new Date(item.watchedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link to={`/watch/${item.episodeSlug}`} className="p-2 rounded-lg bg-brand/20 text-brand hover:bg-brand/30 transition-colors min-h-[36px] flex items-center justify-center" title="Lanjut tonton">
                        <RotateCcw size={13} />
                      </Link>
                      <Link to={`/anime/${item.animeSlug}`} className="p-2 rounded-lg bg-bg-elevated text-text-muted hover:text-brand transition-colors min-h-[36px] flex items-center justify-center">
                        <Play size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
