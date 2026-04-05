import { Link } from "react-router-dom";
import { Activity, CheckCircle, ChevronRight, Clock, Zap } from "lucide-react";

const SERVICES = [
  {
    name: "Streaming Servers",
    desc: "Episode playback via Desustream, Vidhide, and mirror servers",
    status: "operational",
    latency: "~80ms",
  },
  {
    name: "Anime Data API",
    desc: "Otakudesu / Sanka Vollerei REST API — episode lists, schedules, search",
    status: "operational",
    latency: "~120ms",
  },
  {
    name: "Search",
    desc: "Full-text anime title search via the REST API",
    status: "operational",
    latency: "~95ms",
  },
  {
    name: "Genre & Schedule",
    desc: "Genre index and weekly airing schedule endpoints",
    status: "operational",
    latency: "~110ms",
  },
  {
    name: "Batch Download Links",
    desc: "Batch download endpoint for completed series",
    status: "operational",
    latency: "~150ms",
  },
  {
    name: "Favorites & History",
    desc: "Browser localStorage — no server dependency",
    status: "operational",
    latency: "<1ms",
  },
];

const INCIDENTS = [
  {
    date: "Apr 3, 2026",
    title: "Vidhide server intermittent failures",
    status: "resolved",
    detail: "A subset of Vidhide embed links returned 503 errors for ~40 minutes. Switching to an alternate server (Filedon / Updesu) resolved playback. Root cause: upstream server maintenance. Fully resolved.",
  },
  {
    date: "Mar 19, 2026",
    title: "Sanka Vollerei API rate limit spike",
    status: "resolved",
    detail: "Increased traffic caused some requests to hit the 50 req/min rate limit, resulting in delayed data loads. Requests normalized within 15 minutes as traffic subsided.",
  },
];

const statusColor: Record<string, string> = {
  operational: "#4ade80",
  degraded: "#facc15",
  outage: "#f87171",
};

const statusLabel: Record<string, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};

export default function AppStatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">App Status</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0 mt-1">
            <Activity size={22} className="text-[#ff8c94]" />
          </div>
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-1 block font-headline">SUPPORT</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">App Status</h1>
            <p className="text-[#737679] text-sm mt-2">
              Last checked: {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        </div>

        {/* Overall banner */}
        <div
          className="flex items-center gap-4 p-5 rounded-2xl mb-10 border"
          style={{
            background: allOperational ? "rgba(74,222,128,0.07)" : "rgba(250,204,21,0.07)",
            borderColor: allOperational ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.25)",
          }}
        >
          <CheckCircle size={24} style={{ color: allOperational ? "#4ade80" : "#facc15" }} className="shrink-0" />
          <div>
            <p className="font-black font-headline text-[#f8f9fe] text-base">
              {allOperational ? "All Systems Operational" : "Partial Service Disruption"}
            </p>
            <p className="text-sm" style={{ color: allOperational ? "#4ade80" : "#facc15" }}>
              {allOperational
                ? "Everything is running smoothly."
                : "One or more services are experiencing issues."}
            </p>
          </div>
        </div>

        {/* Services */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-black text-[#ff8c94] uppercase tracking-widest font-headline shrink-0">Services</h2>
            <div className="flex-1 h-px bg-[#22262b]" />
          </div>

          <div className="space-y-2">
            {SERVICES.map((svc) => (
              <div
                key={svc.name}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-[#101417] border border-[#22262b]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background: statusColor[svc.status],
                      boxShadow: `0 0 6px ${statusColor[svc.status]}80`,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#f8f9fe] leading-none mb-0.5">{svc.name}</p>
                    <p className="text-xs text-[#737679] line-clamp-1">{svc.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1 text-[#737679]">
                    <Zap size={10} />
                    <span className="text-[10px] font-bold">{svc.latency}</span>
                  </div>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{
                      color: statusColor[svc.status],
                      background: `${statusColor[svc.status]}18`,
                      border: `1px solid ${statusColor[svc.status]}30`,
                    }}
                  >
                    {statusLabel[svc.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Incident history */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-black text-[#ff8c94] uppercase tracking-widest font-headline shrink-0">Past Incidents</h2>
            <div className="flex-1 h-px bg-[#22262b]" />
          </div>

          <div className="space-y-4">
            {INCIDENTS.map((inc) => (
              <div key={inc.date} className="p-5 rounded-xl bg-[#101417] border border-[#22262b]">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[#737679]">
                    <Clock size={11} />
                    <span className="text-[10px] font-bold">{inc.date}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {inc.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#f8f9fe] mb-1">{inc.title}</p>
                <p className="text-xs text-[#a9abaf] leading-relaxed">{inc.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Report an issue */}
        <div className="p-8 rounded-2xl border border-[#22262b] bg-[#101417] text-center">
          <h2 className="text-base font-black font-headline text-[#f8f9fe] mb-2">Experiencing an issue?</h2>
          <p className="text-[#a9abaf] text-sm mb-5">
            If something's broken that isn't listed above, let us know.
          </p>
          <a
            href="mailto:lastanteiku@gmail.com?subject=Issue Report — ANIME STREAM"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            Report an Issue
          </a>
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/faq" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">FAQ →</Link>
          <Link to="/feature-request" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Feature Request →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
