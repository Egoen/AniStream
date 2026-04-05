import { Link } from "react-router-dom";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0 mt-1">
            <ShieldCheck size={22} className="text-[#ff8c94]" />
          </div>
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-1 block font-headline">LEGAL</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">Privacy Policy</h1>
            <p className="text-[#737679] text-sm mt-2">Last updated: January 1, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 text-[#a9abaf] leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">1. Information We Collect</h2>
            <p>
              ANIME STREAM is a client-side streaming index application. We do not require account registration and do not collect personally identifiable information (PII) such as your name, email address, or payment details.
            </p>
            <p className="mt-3">
              The following data is stored <strong className="text-[#f8f9fe]">locally in your browser</strong> only (via localStorage) and is never transmitted to our servers:
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#a9abaf]">
              <li>Your watch history (anime and episode slugs, timestamps)</li>
              <li>Your favorites list (anime metadata saved by you)</li>
              <li>Recent search keywords</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">2. Third-Party API</h2>
            <p>
              This site retrieves anime data from the <strong className="text-[#f8f9fe]">Sanka Vollerei REST API</strong> (sankavollerei.com), which aggregates public data from various Indonesian anime streaming sources. By using this site, your browser makes direct requests to that API. Please review their terms of service for their data practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">3. Cookies & Local Storage</h2>
            <p>
              We use the browser's <strong className="text-[#f8f9fe]">localStorage</strong> API to persist your preferences (favorites, watch history, recent searches) across sessions. No tracking cookies or third-party analytics scripts are used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">4. Embedded Content</h2>
            <p>
              The video player may embed streams from third-party servers (e.g., desustream.info, vidhide). These embedded players are governed by their own privacy policies and may set cookies or collect usage data independently.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">5. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-headline text-[#f8f9fe] mb-3">6. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please reach out via the <Link to="/about" className="text-[#ff8c94] hover:underline font-bold">About Us</Link> page.
            </p>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/terms" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Terms of Service →</Link>
          <Link to="/about" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">About Us →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
