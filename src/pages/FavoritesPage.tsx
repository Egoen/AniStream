import { Link } from "react-router-dom";
import { Heart, Trash2, Play } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const FALLBACK = "https://via.placeholder.com/300x420/111118/7c3aed?text=No+Image";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={20} className="text-brand" />
        <h1 className="text-xl font-bold text-text-base">Anime Favorit</h1>
        <span className="ml-2 text-sm text-text-subtle">({favorites.length})</span>
        <div className="ml-2 h-px flex-1 bg-brand/20" />
      </div>

      {favorites.length === 0 ? (
        <div className="py-24 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-text-base font-semibold mb-2">Belum ada favorit</h3>
          <p className="text-text-muted text-sm mb-6">Tambahkan anime favoritmu dari halaman detail anime</p>
          <Link to="/" className="px-5 py-2.5 bg-brand hover:bg-brand-light rounded-xl text-sm font-semibold text-white transition-colors">
            Jelajahi Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {favorites.map((item) => (
            <div key={item.slug} className="flex items-center gap-3 p-3 bg-bg-card border border-subtle rounded-xl group hover:border-brand/20 transition-colors">
              <img src={item.poster || FALLBACK} alt={item.title} className="w-14 h-20 object-cover rounded-lg shrink-0" onError={e => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-base line-clamp-2 mb-1">{item.title}</p>
                {item.genres && <p className="text-[11px] text-text-subtle line-clamp-1">{item.genres.map(g => g.name).join(", ")}</p>}
                {item.status && (
                  <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${item.status === "Ongoing" ? "bg-accent-cyan/20 text-accent-cyan" : "bg-brand/20 text-brand"}`}>{item.status}</span>
                )}
                <p className="text-[10px] text-text-subtle mt-1">
                  {new Date(item.addedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link to={`/anime/${item.slug}`} className="p-2 rounded-lg bg-brand/20 text-brand hover:bg-brand/30 transition-colors min-h-[36px] flex items-center justify-center">
                  <Play size={13} />
                </Link>
                <button onClick={() => removeFavorite(item.slug)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors min-h-[36px] flex items-center justify-center">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
