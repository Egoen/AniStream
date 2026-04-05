import { Link } from "react-router-dom";
import { ScrollText, ChevronRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0 mt-1">
            <ScrollText size={22} className="text-[#ff8c94]" />
          </div>
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-1 block font-headline">LEGAL</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">Terms of Service</h1>
            <p className="text-[#737679] text-sm mt-2">Last updated: January 1, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 text-[#a9abaf] leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ANIME STREAM ("the Site"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">2. Nature of the Service</h2>
            <p>
              ANIME STREAM is an anime content index and streaming aggregator. It does not host any video content directly. All streaming links and episode data are sourced from the <strong className="text-[#f8f9fe]">Sanka Vollerei API</strong>, which aggregates publicly available content from third-party sources.
            </p>
            <p className="mt-3">
              We do not claim ownership of any anime titles, artwork, or video content displayed on this Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">3. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to scrape, reverse-engineer, or abuse the underlying API</li>
              <li>Circumvent rate limits or protection mechanisms</li>
              <li>Redistribute or sell access to the Site or its data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">4. Intellectual Property</h2>
            <p>
              All anime titles, characters, and related artwork are the intellectual property of their respective owners and licensors. ANIME STREAM makes no claim to these works. The Site's own UI code and design are original works.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">5. Disclaimer of Warranties</h2>
            <p>
              The Site is provided <strong className="text-[#f8f9fe]">"as is"</strong> without any warranty of any kind, express or implied. We do not guarantee that the Site will be available at all times or that streaming links will function correctly, as these depend on third-party providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ANIME STREAM shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the Site or its content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">7. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes your acceptance of the new Terms.
            </p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/privacy" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Privacy Policy →</Link>
          <Link to="/about" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">About Us →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
