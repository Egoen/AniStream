import { Link } from "react-router-dom";
import { ChevronRight, Tv, Zap, Globe, Heart, Play } from "lucide-react";

const FEATURES = [
  {
    icon: Tv,
    title: "10,000+ Titles",
    desc: "Browse and stream from a comprehensive library of ongoing and completed anime, updated in real-time.",
  },
  {
    icon: Zap,
    title: "Multi-Quality Streaming",
    desc: "Watch in 360p, 480p, or 720p with multiple server mirrors — always find a working stream.",
  },
  {
    icon: Globe,
    title: "Indonesian Subtitles",
    desc: "All content is subtitled in Indonesian (Sub Indo), sourced from Otakudesu and partner sites.",
  },
  {
    icon: Heart,
    title: "Favorites & History",
    desc: "Save anime to your favorites and track your watch history — all stored locally in your browser.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-4xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">About Us</span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-3 block font-headline">ABOUT</span>
          <h1 className="text-5xl font-extrabold tracking-tight font-headline text-[#f8f9fe] mb-5 leading-tight">
            Built for<br /><span className="text-[#ff8c94]">Anime Fans.</span>
          </h1>
          <p className="text-[#a9abaf] text-base leading-relaxed max-w-2xl">
            ANIME STREAM is a passion project — a cinematic, modern-design anime streaming index that pulls live data from the
            {" "}<strong className="text-[#f8f9fe]">Sanka Vollerei API</strong> (powered by Otakudesu). No registration, no ads in the interface, just anime.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-[#22262b] bg-[#101417] hover:border-[#ff8c94]/25 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ff8c94]/12 border border-[#ff8c94]/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#ff8c94]" />
              </div>
              <h3 className="text-sm font-black font-headline text-[#f8f9fe] mb-2">{title}</h3>
              <p className="text-xs text-[#a9abaf] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Data source */}
        <div className="bg-[#101417] border border-[#22262b] rounded-2xl p-8 mb-16">
          <h2 className="text-xl font-black font-headline text-[#f8f9fe] mb-4">Data Source</h2>
          <p className="text-[#a9abaf] text-sm leading-relaxed mb-4">
            All anime data, streaming links, episode lists, schedules, and genre information are sourced from the
            {" "}<strong className="text-[#f8f9fe]">Sanka Vollerei REST API</strong> — a free, publicly available anime API aggregating content from Otakudesu, Samehadaku, and other Indonesian anime platforms.
          </p>
          <p className="text-[#737679] text-sm leading-relaxed">
            ANIME STREAM does not host any video files. All streams are embedded from third-party servers and remain the property of their respective owners. This site respects a rate limit of 50 requests/minute as required by the API provider.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-black font-headline text-[#f8f9fe] mb-3">Ready to watch?</h2>
          <p className="text-[#a9abaf] text-sm mb-6">Jump straight into the latest ongoing anime or browse the full library.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/ongoing"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
              style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
            >
              <Play size={14} fill="black" /> Watch Now
            </Link>
            <Link
              to="/all-anime"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#22262b] font-bold font-headline uppercase tracking-wider text-sm text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#161a1e] transition-all"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/privacy" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Privacy Policy →</Link>
          <Link to="/terms" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Terms of Service →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
