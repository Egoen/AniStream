import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import type { Anime } from "@/types/anime";

interface Props {
  anime: Anime;
  size?: "sm" | "md" | "lg";
}

const FALLBACK_IMG = "https://via.placeholder.com/300x420/111118/7c3aed?text=No+Image";

export default function AnimeCard({ anime, size = "md" }: Props) {
  const href = `/anime/${anime.slug}`;

  const sizeClasses = { sm: "w-32 sm:w-36", md: "w-36 sm:w-44", lg: "w-44 sm:w-52" };
  const imgHeights = { sm: "h-44 sm:h-52", md: "h-52 sm:h-60", lg: "h-60 sm:h-72" };

  return (
    <Link to={href} className={`${sizeClasses[size]} shrink-0 group anime-card-hover block`}>
      <div className={`relative ${imgHeights[size]} rounded-xl overflow-hidden bg-bg-card border border-subtle`}>
        <img
          src={anime.poster || FALLBACK_IMG}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-brand/90 rounded-full p-2.5 brand-glow">
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
        {anime.status && (
          <div className="absolute top-2 left-2">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
              anime.status === "Ongoing" ? "bg-accent-cyan/90 text-bg-base" : "bg-brand/90 text-white"
            }`}>
              {anime.status}
            </span>
          </div>
        )}
        {anime.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-bg-base/80 rounded-md px-1.5 py-0.5">
            <Star size={9} fill="#f59e0b" className="text-accent-amber" />
            <span className="text-[9px] font-semibold text-text-base">{anime.rating}</span>
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-semibold text-text-base line-clamp-2 leading-tight group-hover:text-brand-light transition-colors">
          {anime.title}
        </p>
        {anime.genres && anime.genres.length > 0 && (
          <p className="text-[10px] text-text-subtle mt-0.5 line-clamp-1">
            {anime.genres.slice(0, 2).map((g) => g.name).join(", ")}
          </p>
        )}
        {anime.releaseDay && !anime.genres?.length && (
          <p className="text-[10px] text-text-subtle mt-0.5">{anime.releaseDay}</p>
        )}
      </div>
    </Link>
  );
}
