import { useState } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ChevronRight, Send, CheckCircle } from "lucide-react";

const CATEGORIES = [
  "New Feature",
  "Content Request",
  "UI / Design",
  "Performance",
  "Bug Report",
  "Other",
];

export default function FeatureRequestPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = "Please select a category.";
    if (!title.trim() || title.trim().length < 5) e.title = "Title must be at least 5 characters.";
    if (!detail.trim() || detail.trim().length < 20) e.detail = "Please provide at least 20 characters of detail.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    // Build mailto link and open it
    const subject = encodeURIComponent(`[${category}] ${title.trim()}`);
    const body = encodeURIComponent(
      `Category: ${category}\n\nRequest / Suggestion:\n${detail.trim()}${email ? `\n\nReply to: ${email}` : ""}`
    );
    window.open(`mailto:lastanteiku@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#0b0e11] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)" }}
          >
            <CheckCircle size={36} className="text-emerald-400" />
          </div>
          <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-3 block font-headline uppercase">Submitted</span>
          <h2 className="text-3xl font-black font-headline text-[#f8f9fe] mb-3">Thank You!</h2>
          <p className="text-[#a9abaf] text-sm leading-relaxed mb-8">
            Your feature request has been sent. We review all suggestions and will reach out if we need more details.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setSubmitted(false); setTitle(""); setDetail(""); setCategory(""); setEmail(""); }}
              className="px-6 py-3 rounded-xl border border-[#22262b] font-bold text-sm text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#161a1e] transition-all"
            >
              Submit Another
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-105 transition-transform shadow-lg shadow-[#ff8c94]/20"
              style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <main className="max-w-2xl mx-auto px-6 md:px-8 pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#737679] mb-8 font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#ff8c94] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#a9abaf]">Feature Request</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8c94]/15 border border-[#ff8c94]/25 flex items-center justify-center shrink-0 mt-1">
            <Lightbulb size={22} className="text-[#ff8c94]" />
          </div>
          <div>
            <span className="text-[#ff8c94] font-bold tracking-widest text-xs mb-1 block font-headline">SUPPORT</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-[#f8f9fe]">Feature Request</h1>
            <p className="text-[#a9abaf] text-sm mt-2">
              Have an idea or want new content? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Category */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#a9abaf] mb-3 font-headline">
              Category <span className="text-[#ff8c94]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setErrors((e) => ({ ...e, category: "" })); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold border transition-all min-h-[44px]"
                  style={category === cat
                    ? { background: "rgba(255,140,148,0.15)", borderColor: "rgba(255,140,148,0.5)", color: "#ff8c94" }
                    : { background: "#101417", borderColor: "#22262b", color: "#a9abaf" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">⚠ {errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-black uppercase tracking-widest text-[#a9abaf] mb-3 font-headline">
              Title <span className="text-[#ff8c94]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((err) => ({ ...err, title: "" })); }}
              placeholder="Brief summary of your request..."
              maxLength={120}
              className="w-full px-4 py-3.5 rounded-xl text-sm text-[#f8f9fe] placeholder-[#737679] outline-none border transition-all min-h-[44px]"
              style={{
                background: "#101417",
                borderColor: errors.title ? "rgba(248,113,113,0.5)" : "#22262b",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#ff8c94"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.title ? "rgba(248,113,113,0.5)" : "#22262b"; }}
            />
            {errors.title && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">⚠ {errors.title}</p>
            )}
          </div>

          {/* Detail */}
          <div>
            <label htmlFor="detail" className="block text-xs font-black uppercase tracking-widest text-[#a9abaf] mb-3 font-headline">
              Details <span className="text-[#ff8c94]">*</span>
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => { setDetail(e.target.value); setErrors((err) => ({ ...err, detail: "" })); }}
              placeholder="Describe your idea or request in detail. The more context, the better..."
              rows={5}
              maxLength={2000}
              className="w-full px-4 py-3.5 rounded-xl text-sm text-[#f8f9fe] placeholder-[#737679] outline-none border transition-all resize-none"
              style={{
                background: "#101417",
                borderColor: errors.detail ? "rgba(248,113,113,0.5)" : "#22262b",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#ff8c94"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.detail ? "rgba(248,113,113,0.5)" : "#22262b"; }}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.detail
                ? <p className="text-xs text-rose-400 flex items-center gap-1">⚠ {errors.detail}</p>
                : <span />
              }
              <span className="text-[10px] text-[#737679]">{detail.length} / 2000</span>
            </div>
          </div>

          {/* Email (optional) */}
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-[#a9abaf] mb-3 font-headline">
              Email <span className="text-[#737679] font-normal normal-case tracking-normal">(optional — for follow-up)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((err) => ({ ...err, email: "" })); }}
              placeholder="your@email.com"
              className="w-full px-4 py-3.5 rounded-xl text-sm text-[#f8f9fe] placeholder-[#737679] outline-none border transition-all min-h-[44px]"
              style={{
                background: "#101417",
                borderColor: errors.email ? "rgba(248,113,113,0.5)" : "#22262b",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#ff8c94"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "rgba(248,113,113,0.5)" : "#22262b"; }}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">⚠ {errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black font-headline uppercase tracking-wider text-sm text-black hover:scale-[1.02] transition-transform shadow-lg shadow-[#ff8c94]/20 mt-2 min-h-[52px]"
            style={{ background: "linear-gradient(135deg, #ff8c94, #ff7481)" }}
          >
            <Send size={15} className="text-black" /> Submit Request
          </button>

          <p className="text-[10px] text-[#737679] text-center leading-relaxed">
            This will open your email client with your request pre-filled and send it to{" "}
            <span className="text-[#a9abaf]">lastanteiku@gmail.com</span>.
          </p>
        </form>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[#22262b] flex flex-wrap gap-4">
          <Link to="/faq" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">FAQ →</Link>
          <Link to="/app-status" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">App Status →</Link>
          <Link to="/" className="text-[#a9abaf] hover:text-[#ff8c94] text-sm font-bold transition-colors">Back to Home →</Link>
        </div>
      </main>
    </div>
  );
}
