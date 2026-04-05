import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Star, Info } from "lucide-react";
import type { Anime } from "@/types/anime";
import heroBanner from "@/assets/hero-banner.jpg";

interface Props {
  featured?: Anime[];
}

export default function HeroSection({ featured }: Props) {
  const [current, setCurrent] = useState(0);
  const items = featured?.slice(0, 5) || [];

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const anime = items[current];

  return (
    <div className="relative w-full h-[60vw] max-h-[500px] min-h-[280px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={anime?.poster || heroBanner}
          alt={anime?.title || "AniStream"}
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
        {anime ? (
          <div className="max-w-md animate-slide-up">
            {anime.status && (
              <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest mb-2 ${
                anime.status === "Ongoing" ? "bg-accent-cyan text-bg-base" : "bg-brand text-white"
              }`}>{anime.status}</span>
            )}
            <h1 className="text-xl sm:text-3xl font-bold text-text-base line-clamp-2 leading-tight mb-2">{anime.title}</h1>
            <div className="flex items-center gap-3 mb-3">
              {anime.rating && (
                <div className="flex items-center gap-1">
                  <Star size={13} fill="#f59e0b" className="text-accent-amber" />
                  <span className="text-sm font-semibold text-accent-amber">{anime.rating}</span>
                </div>
              )}
              {anime.releaseDay && <span className="text-sm text-text-muted">{anime.releaseDay}</span>}
              {anime.genres?.[0] && <span className="text-sm text-text-muted">{anime.genres[0].name}</span>}
              {anime.totalEpisode && <span className="text-sm text-text-muted">{anime.totalEpisode} ep</span>}
            </div>
            {anime.synopsis && <p className="text-sm text-text-muted line-clamp-2 mb-4">{anime.synopsis}</p>}
            <div className="flex items-center gap-3">
              <Link to={`/anime/${anime.slug}`} className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-light rounded-xl font-semibold text-sm text-white transition-colors brand-glow min-h-[44px]">
                <Play size={15} fill="white" /> Tonton
              </Link>
              <Link to={`/anime/${anime.slug}`} className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated/80 border border-subtle hover:border-brand/40 rounded-xl font-semibold text-sm text-text-muted hover:text-text-base transition-colors min-h-[44px]">
                <Info size={15} /> Detail
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-md space-y-2">
            <div className="h-8 w-64 rounded shimmer-bg" />
            <div className="h-4 w-40 rounded shimmer-bg" />
            <div className="h-16 rounded shimmer-bg mt-3" />
            <div className="flex gap-3 mt-2">
              <div className="h-10 w-28 rounded-xl shimmer-bg" />
              <div className="h-10 w-24 rounded-xl shimmer-bg" />
            </div>
          </div>
        )}

        {/* Slide dots */}
        {items.length > 1 && (
          <div className="flex gap-1.5 mt-4">
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1 rounded-full transition-all ${i === current ? "w-6 bg-brand" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
