import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    category: "Streaming",
    items: [
      {
        q: "Why won't the video load?",
        a: "The video player uses third-party embed servers (e.g. Desustream, Vidhide). If one server fails, click 'SELECT SERVER' and try a different one — usually there are 3–4 alternatives per quality level.",
      },
      {
        q: "Which video quality should I choose?",
        a: "For most connections, 480p gives the best balance of quality and speed. Choose 720p if you have a fast connection and want sharper visuals. 360p is great for mobile data.",
      },
      {
        q: "The player shows a black screen. What do I do?",
        a: "Try switching servers under the 'SELECT SERVER' section. If all servers fail, the episode may not be available yet — check back later or try a different quality.",
      },
      {
        q: "Can I download episodes?",
        a: "Yes. On the Watch page, scroll down to the 'DOWNLOAD' panel. Each episode has download links organized by quality (360p / 480p / 720p / 1080p) with multiple mirror hosts.",
      },
    ],
  },
  {
    category: "Favorites & History",
    items: [
      {
        q: "How do I add an anime to my Favorites?",
        a: "Open any anime detail page and click the heart button near the top. The anime will be saved to your Favorites collection instantly.",
      },
      {
        q: "Is my data synced across devices?",
        a: "No. Favorites and watch history are stored locally in your browser's localStorage. They don't sync across devices or browsers.",
      },
      {
        q: "How do I clear my watch history?",
        a: "Go to the History page and click 'Clear All' in the top-right corner. You can also remove individual entries from each row.",
      },
      {
        q: "Why did my favorites disappear?",
        a: "Favorites are stored in localStorage. Clearing your browser's site data or switching to a different browser will remove them.",
      },
    ],
  },
  {
    category: "Content",
    items: [
      {
        q: "Where does the anime data come from?",
        a: "All data is sourced from the Sanka Vollerei REST API, which aggregates content from Otakudesu and other Indonesian anime platforms. We do not host any video files directly.",
      },
      {
        q: "Are all anime subtitled in Indonesian?",
        a: "Yes. All content is in Indonesian subtitle (Sub Indo) format, as sourced from Otakudesu.",
      },
      {
        q: "Can I request an anime to be added?",
        a: "Content availability depends on the source API. Use the Feature Request page to submit suggestions — we'll do our best to relay them.",
      },
      {
        q: "Why are some episode links missing?",
        a: "Episode availability is determined by the upstream source. Some older or less popular titles may have incomplete episode lists.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        q: "The site is slow or not loading. What's wrong?",
        a: "The API enforces a rate limit of 50 requests per minute. Heavy traffic may cause temporary slowdowns. Check the App Status page for any ongoing incidents.",
      },
      {
        q: "Does this site work on mobile?",
        a: "Yes. The site is fully responsive and works on all modern mobile browsers. The bottom navigation bar makes it easy to browse on smaller screens.",
      },
      {
        q: "Is there a mobile app?",
        a: "Not currently. The website is mobile-optimized and works as a Progressive Web App (PWA) — you can add it to your home screen from your browser's menu.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#22262b] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-[#101417] hover:bg-[#161a1e] transition-colors"
      >
        <span className="text-sm font-bold text-[#f8f9fe] leading-snug">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-[#ff8c94] shrink-0" />
          : <ChevronDown size={15} className="text-[#a9abaf] shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 py-4 bg-[#0d1114] border-t border-[#22262b]">
          <p className="text-sm text-[#a9abaf] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">FAQ</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0 mt-1">
            <HelpCircle size={22} className="text-[#ff8c94]" />
          </div>
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-1 block font-headline">SUPPORT</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">
              Frequently Asked Questions
            </h1>
            <p className="text-[#a9abaf] text-sm mt-2">
              Can't find your answer? <a href="mailto:lastanteiku@gmail.com" className="text-[#ff8c94] hover:underline font-bold">Email us directly.</a>
            </p>
          </div>
        </div>

        {/* FAQ sections */}
        <div className="space-y-12">
          {FAQS.map(({ category, items }) => (
            <section key={category}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-black text-[#ff8c94] uppercase tracking-widest font-headline shrink-0">
                  {category}
                </h2>
                <div className="flex-1 h-px bg-[#22262b]" />
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <FAQItem key={item.q} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 p-8 rounded-2xl border border-[#22262b] bg-[#101417] text-center">
          <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-2">Still need help?</h2>
          <p className="text-[#a9abaf] text-sm mb-5">Our support team is just an email away.</p>
          <a
            href="mailto:lastanteiku@gmail.com"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            Contact Support
          </a>
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/app-status" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">App Status →</Link>
          <Link to="/feature-request" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Feature Request →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
