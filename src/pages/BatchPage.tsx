import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Download, Star, Calendar, Clock, Tv, Building2,
  ChevronRight, Loader2, AlertCircle, Package, ExternalLink,
} from "lucide-react";
import { useBatch } from "@/hooks/useAnimeQuery";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function BatchSkeleton() {
  return (
    <div className="bg-[#0b0e11] min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 space-y-6">
        <div className="flex gap-6">
          <div className="w-44 h-64 rounded-2xl bg-[#1c2024] animate-pulse shrink-0" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="h-8 bg-[#1c2024] rounded animate-pulse w-3/4" />
            <div className="h-4 bg-[#1c2024] rounded animate-pulse w-1/2" />
            <div className="flex gap-2 mt-2">
              {[60, 80, 70].map((w, i) => <div key={i} className="h-6 rounded-full bg-[#1c2024] animate-pulse" style={{ width: w }} />)}
            </div>
          </div>
        </div>
        <div className="h-56 bg-[#1c2024] rounded-2xl animate-pulse" />
        <div className="h-40 bg-[#1c2024] rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

// ── Download Quality Block ────────────────────────────────────────────────────
function QualityBlock({ quality, size, urls }: { quality: string; size?: string; urls: Array<{ title: string; url: string }> }) {
  const isMP4 = quality.toUpperCase().includes("MP4");
  const isMKV = quality.toUpperCase().includes("MKV");
  return (
    <div className="border border-[#22262b] rounded-2xl overflow-hidden">
      {/* Quality header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#161a1e] border-b border-[#22262b]">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
            isMP4 ? "bg-sky-600/20 text-sky-400 border border-sky-600/30" :
            isMKV ? "bg-violet-600/20 text-violet-400 border border-violet-600/30" :
            "bg-[#22262b] text-[#a9abaf]"
          }`}>
            {quality}
          </span>
          {size && (
            <span className="text-xs text-[#737679] font-medium">{size}</span>
          )}
        </div>
        <span className="text-xs text-[#737679]">{urls.length} mirror{urls.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Download links */}
      <div className="p-4 flex flex-wrap gap-2">
        {urls.map((u) => (
          <a
            key={u.title + u.url}
            href={u.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101417] border border-[#22262b] text-sm font-bold text-[#a9abaf] hover:text-[#f8f9fe] hover:border-[#ff8c94]/40 hover:bg-[#161a1e] transition-all min-h-[44px] group"
          >
            <ExternalLink size={12} className="text-[#737679] group-hover:text-[#ff8c94] transition-colors shrink-0" />
            {u.title}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Batch Search Form ─────────────────────────────────────────────────────────
function BatchSearchForm() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = input.trim();
    if (slug) navigate(`/batch/${slug}`);
  };
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-12">
        <div className="mb-10">
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">DOWNLOAD</span>
          <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe] mb-2">Batch Download</h1>
          <p className="text-[#a9abaf] text-sm">Enter an anime batch slug to get full-series download links.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-3 mb-12"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. jshk-s2-batch-sub-indo"
            className="flex-1 px-5 py-4 rounded-xl bg-[#161a1e] border border-[#22262b] focus:border-[#ff8c94]/50 text-[#f8f9fe] placeholder-[#737679] outline-none text-sm font-medium transition-colors"
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            Get Links
          </button>
        </form>

        {/* Help text */}
        <div className="bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
          <div className="flex items-start gap-3 mb-4">
            <Package size={18} className="text-[#ff8c94] shrink-0 mt-0.5" />
            <h3 className="text-sm font-black font-headline text-[#f8f9fe] uppercase tracking-wider">How to use</h3>
          </div>
          <ol className="space-y-3 text-sm text-[#a9abaf]">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#ff8c94]/20 text-[#ff8c94] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
              Find an anime you want to download on the detail page.
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#ff8c94]/20 text-[#ff8c94] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
              Copy the batch slug from the anime detail page (e.g. <code className="text-[#ff8c94] text-xs bg-[#22262b] px-1.5 py-0.5 rounded">jshk-s2-batch-sub-indo</code>).
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#ff8c94]/20 text-[#ff8c94] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
              Enter the slug above and click <strong className="text-[#f8f9fe]">Get Links</strong> to see all download mirrors.
            </li>
          </ol>
        </div>

        {/* Example slugs */}
        <div className="mt-8">
          <p className="text-xs text-[#737679] uppercase font-bold tracking-widest mb-3">Example slugs</p>
          <div className="flex flex-wrap gap-2">
            {[
              "jshk-s2-batch-sub-indo",
              "kny-batch-sub-indo",
              "aot-s4-batch-sub-indo",
            ].map((slug) => (
              <button
                key={slug}
                onClick={() => navigate(`/batch/${slug}`)}
                className="px-3 py-2 rounded-lg bg-[#161a1e] border border-[#22262b] text-xs font-bold text-[#a9abaf] hover:text-[#ff8c94] hover:border-[#ff8c94]/30 transition-all font-mono"
              >
                {slug}
              </button>
            ))}
          </div>
        </div>

        <footer className="border-t border-[#22262b] mt-24 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Home</Link>
              <Link to="/all-anime" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">All Anime</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BatchPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [openFormat, setOpenFormat] = useState<number | null>(0);

  const { data: batch, isLoading, isError, refetch } = useBatch(slug!);

  // No slug — show search form
  if (!slug) return <BatchSearchForm />;

  if (isLoading) return <BatchSkeleton />;

  if (isError || !batch) return (
    <div className="bg-[#0b0e11] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
        <p className="text-[#a9abaf] text-lg mb-2">Batch not found or unavailable.</p>
        <p className="text-[#737679] text-sm mb-6">Make sure the batch slug is correct.</p>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={refetch}
            className="px-5 py-2.5 text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            Try Again
          </button>
          <Link to="/batch" className="px-5 py-2.5 text-[#a9abaf] font-bold rounded-xl text-sm border border-[#22262b] bg-[#161a1e] hover:text-[#f8f9fe] transition-colors">
            Search Batch
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-28 pb-12">

        {/* ── Back ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-10">
          <Link
            to="/batch"
            className="flex items-center gap-1.5 text-[#a9abaf] hover:text-[#ff8c94] text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={13} /> Batch Search
          </Link>
          <ChevronRight size={12} className="text-[#45484c]" />
          <span className="text-[#737679] text-xs font-bold uppercase tracking-widest truncate max-w-xs">{slug}</span>
        </div>

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="shrink-0 w-40 sm:w-48">
            <img
              src={batch.poster || FALLBACK}
              alt={batch.title}
              className="w-full aspect-[3/4] object-cover rounded-2xl border-2 border-[#ff8c94]/20 shadow-2xl shadow-black/60"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Label */}
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-2 block font-headline">DOWNLOAD</span>

            <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-[#f8f9fe] leading-tight mb-1">
              {batch.title}
            </h1>
            {batch.japanese && (
              <p className="text-sm text-[#737679] mb-4 font-medium">{batch.japanese}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              {batch.rating && !isNaN(Number(batch.rating)) && (
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#f59e0b" className="text-amber-400" />
                  <span className="font-bold text-amber-400">{Number(batch.rating).toFixed(2)}</span>
                </div>
              )}
              {batch.type && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Tv size={13} /><span>{batch.type}</span>
                </div>
              )}
              {batch.episodes && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Package size={13} /><span>{batch.episodes} Episodes</span>
                </div>
              )}
              {batch.duration && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Clock size={13} /><span>{batch.duration}</span>
                </div>
              )}
              {batch.studio && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Building2 size={13} /><span>{batch.studio}</span>
                </div>
              )}
              {batch.aired && (
                <div className="flex items-center gap-1.5 text-[#a9abaf]">
                  <Calendar size={13} /><span>{batch.aired}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {batch.genres && batch.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {batch.genres.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/genre/${g.slug}`}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#b08af7]/15 text-[#b08af7] border border-[#b08af7]/25 hover:bg-[#b08af7]/25 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Watch button */}
            {batch.slug && (
              <Link
                to={`/anime/${batch.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#22262b] text-sm font-bold text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#1c2024] transition-all bg-[#101417]"
              >
                View Anime Details <ChevronRight size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* ── Download Section ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Download size={18} className="text-[#ff8c94]" />
            <h2 className="text-xl font-black font-headline text-[#f8f9fe] uppercase tracking-wider">Download Links</h2>
            {batch.formats.length > 0 && (
              <span className="text-xs text-[#737679] font-bold">
                {batch.formats.reduce((s, f) => s + f.qualities.length, 0)} quality options
              </span>
            )}
          </div>

          {batch.formats.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-[#22262b] bg-[#101417]">
              <Download size={28} className="text-[#45484c] mx-auto mb-3" />
              <p className="text-[#a9abaf]">No download links available for this batch.</p>
            </div>
          ) : (
            batch.formats.map((fmt, fi) => (
              <div key={fi} className="bg-[#101417] rounded-2xl border border-[#22262b] overflow-hidden">
                {/* Format header (collapsible) */}
                <button
                  onClick={() => setOpenFormat(openFormat === fi ? null : fi)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#161a1e] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0">
                      <Download size={14} className="text-[#ff8c94]" />
                    </div>
                    <span className="text-sm font-black text-[#f8f9fe] font-headline line-clamp-1">{fmt.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#737679]">{fmt.qualities.length} qualities</span>
                    <ChevronRight
                      size={14}
                      className={`text-[#737679] transition-transform ${openFormat === fi ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {/* Quality list */}
                {openFormat === fi && (
                  <div className="px-6 pb-6 space-y-3 border-t border-[#22262b] pt-4">
                    {fmt.qualities.map((q, qi) => (
                      <QualityBlock key={qi} quality={q.quality} size={q.size} urls={q.urls} />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Info sidebar ─────────────────────────────────────────────── */}
        {(batch.producers || batch.credit) && (
          <div className="mt-8 bg-[#101417] rounded-2xl p-6 border border-[#22262b]">
            <h3 className="text-sm font-black font-headline text-[#f8f9fe] mb-4 uppercase tracking-widest">Additional Info</h3>
            <div className="space-y-3">
              {batch.producers && (
                <div className="flex gap-3 text-sm">
                  <span className="text-xs text-[#737679] uppercase tracking-widest font-bold shrink-0 pt-0.5 w-20">Producers</span>
                  <span className="text-[#a9abaf]">{batch.producers}</span>
                </div>
              )}
              {batch.credit && (
                <div className="flex gap-3 text-sm">
                  <span className="text-xs text-[#737679] uppercase tracking-widest font-bold shrink-0 pt-0.5 w-20">Credit</span>
                  <span className="text-[#a9abaf]">{batch.credit}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="border-t border-[#22262b] mt-24 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[#737679] text-sm">© 2025 ANIME STREAM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Home</Link>
              <Link to="/all-anime" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">All Anime</Link>
              <Link to="/batch" className="text-[#737679] hover:text-[#ff8c94] transition-colors text-sm">Batch</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
