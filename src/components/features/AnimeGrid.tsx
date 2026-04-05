import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import type { Anime } from "@/types/anime";

interface Props {
  animes: Anime[];
}

const FALLBACK = "https://via.placeholder.com/300x420/111118/7c3aed?text=No+Image";

export default function AnimeGrid({ animes }: Props) {
  if (!animes.length) return (
    <div className="col-span-full py-16 text-center text-text-subtle">Tidak ada anime ditemukan.</div>
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      {animes.map((anime) => (
        <Link key={anime.slug} to={`/anime/${anime.slug}`} className="group anime-card-hover block">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-card border border-subtle">
            <img
              src={anime.poster || FALLBACK}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            />
            <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-brand/90 rounded-full p-2 brand-glow">
                <Play size={14} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
            {anime.status && (
              <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                anime.status === "Ongoing" ? "bg-accent-cyan/90 text-bg-base" : "bg-brand/90 text-white"
              }`}>{anime.status}</span>
            )}
            {anime.rating && (
              <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-bg-base/80 rounded px-1 py-0.5">
                <Star size={8} fill="#f59e0b" className="text-accent-amber" />
                <span className="text-[9px] font-semibold text-text-base">{anime.rating}</span>
              </div>
            )}
            {/* Episode count badge */}
            {anime.totalEpisode && (
              <div className="absolute bottom-1.5 left-1.5 bg-bg-base/80 rounded px-1 py-0.5">
                <span className="text-[9px] font-semibold text-text-muted">{anime.totalEpisode} ep</span>
              </div>
            )}
          </div>
          <p className="mt-1.5 text-xs font-medium text-text-base line-clamp-2 leading-tight group-hover:text-brand-light transition-colors">
            {anime.title}
          </p>
          {anime.releaseDay && (
            <p className="text-[10px] text-text-subtle mt-0.5">{anime.releaseDay} · {anime.latestReleaseDate}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
