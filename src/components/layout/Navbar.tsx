import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, X, User, Menu, Play } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useSearch } from "@/hooks/useAnimeQuery";

const FALLBACK = "https://via.placeholder.com/300x420/111118/ff8c94?text=No+Image";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addRecentSearch } = useAppStore();

  // Debounce the search query by 300ms
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  // Fetch live results using debounced query (desktop)
  const { data: searchResults } = useSearch(debouncedQuery);
  const results = (searchResults || []).slice(0, 6);

  // Open/close dropdown
  useEffect(() => {
    if (debouncedQuery.length >= 2 && results.length > 0) {
      setDropdownOpen(true);
      setActiveIndex(-1);
    } else {
      setDropdownOpen(false);
    }
  }, [debouncedQuery, results.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        desktopInputRef.current &&
        !desktopInputRef.current.closest("form")?.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    setActiveIndex(-1);
  }, []);

  const navigateToResult = useCallback((slug: string) => {
    closeDropdown();
    setQuery("");
    setDebouncedQuery("");
    navigate(`/anime/${slug}`);
  }, [navigate, closeDropdown]);

  const handleDesktopKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = results[activeIndex];
      if (selected) navigateToResult(selected.slug);
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    closeDropdown();
    addRecentSearch(query.trim());
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
    setDebouncedQuery("");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Ongoing", to: "/ongoing" },
    { label: "Completed", to: "/completed" },
    { label: "Genre", to: "/genre" },
    { label: "Schedule", to: "/schedule" },
    { label: "All Anime", to: "/all-anime" },
    { label: "Batch DL", to: "/batch" },
  ];

  const isActive = (to: string) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-8 py-4"
        style={{ background: "rgba(11,14,17,0.6)", backdropFilter: "blur(24px)", boxShadow: "0 2px 40px rgba(0,0,0,0.4)" }}>

        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-[#f8f9fe] font-headline uppercase">
            ANIME STREAM
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-bold font-headline tracking-tight transition-colors pb-0.5 text-sm ${
                  isActive(l.to)
                    ? "text-[#ff8c94] border-b-2 border-[#ff8c94]"
                    : "text-[#a9abaf] hover:text-[#f8f9fe]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Search + User */}
        <div className="flex items-center gap-4">
          {/* Inline search — desktop */}
          <div className="hidden lg:block relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-[#22262b]/60 rounded-full px-4 py-2 border border-[#45484c]/20 transition-all focus-within:border-[#ff8c94]/50 gap-2"
            >
              <Search size={16} className="text-[#a9abaf] shrink-0" />
              <input
                ref={desktopInputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                onKeyDown={handleDesktopKeyDown}
                onFocus={() => { if (debouncedQuery.length >= 2 && results.length > 0) setDropdownOpen(true); }}
                placeholder="Search anime..."
                className="bg-transparent border-none focus:ring-0 text-sm w-44 text-[#f8f9fe] placeholder:text-[#737679] outline-none"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setDebouncedQuery(""); closeDropdown(); }}
                  className="text-[#737679] hover:text-[#f8f9fe] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </form>

            {/* Live Dropdown */}
            {dropdownOpen && results.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-[#ff8c94]/20 overflow-hidden z-50"
                style={{
                  background: "rgba(11,14,17,0.97)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,140,148,0.08)",
                  animation: "dropdownFadeIn 0.15s ease-out",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#22262b]">
                  <span className="text-[10px] font-black text-[#737679] uppercase tracking-widest">Results for "{debouncedQuery}"</span>
                  <span className="text-[10px] text-[#ff8c94] font-bold">{results.length} found</span>
                </div>

                {/* Result rows */}
                <ul>
                  {results.map((anime, idx) => (
                    <li key={anime.slug}>
                      <button
                        onMouseDown={(e) => { e.preventDefault(); navigateToResult(anime.slug); }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-[#1c2024] last:border-0 group ${
                          activeIndex === idx ? "bg-[#ff8c94]/10" : "hover:bg-[#161a1e]"
                        }`}
                      >
                        {/* Poster thumbnail */}
                        <div className="w-9 h-[52px] rounded-lg overflow-hidden shrink-0 relative border border-[#22262b]">
                          <img
                            src={anime.poster || FALLBACK}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                          />
                          {activeIndex === idx && (
                            <div className="absolute inset-0 bg-[#ff8c94]/20 flex items-center justify-center">
                              <Play size={10} fill="white" className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold line-clamp-1 transition-colors ${
                            activeIndex === idx ? "text-[#ff8c94]" : "text-[#f8f9fe]"
                          }`}>
                            {anime.title}
                          </p>
                          <p className="text-[10px] text-[#737679] mt-0.5 line-clamp-1">
                            {anime.genres?.slice(0, 2).map((g) => g.name).join(" · ") || anime.status || "Anime"}
                          </p>
                        </div>

                        {/* Status badge */}
                        {anime.status && (
                          <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                            anime.status === "Ongoing"
                              ? "bg-rose-600/20 text-rose-400 border border-rose-600/30"
                              : "bg-slate-700/30 text-slate-400 border border-slate-600/30"
                          }`}>
                            {anime.status}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Footer: View all results */}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    closeDropdown();
                    addRecentSearch(debouncedQuery);
                    navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`);
                    setQuery("");
                    setDebouncedQuery("");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black text-[#ff8c94] hover:bg-[#ff8c94]/8 transition-colors border-t border-[#22262b] uppercase tracking-widest"
                >
                  <Search size={11} /> View all results
                </button>
              </div>
            )}
          </div>

          {/* Search icon — mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-[#22262b]/60 transition-colors text-[#a9abaf] hover:text-[#f8f9fe]"
          >
            <Search size={18} />
          </button>

          {/* User */}
          <Link to="/favorites" className="hidden sm:flex p-2 rounded-full hover:bg-[#22262b]/60 transition-colors text-[#f8f9fe]">
            <User size={20} />
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-[#22262b]/60 transition-colors text-[#a9abaf]"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed top-[64px] left-0 right-0 z-40 md:hidden border-t border-[#22262b]"
          style={{ background: "rgba(11,14,17,0.95)", backdropFilter: "blur(24px)" }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center px-6 py-3.5 text-sm font-bold font-headline border-b border-[#22262b] last:border-0 transition-colors ${
                isActive(l.to) ? "text-[#ff8c94]" : "text-[#a9abaf] hover:text-[#f8f9fe]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/favorites" className="flex items-center px-6 py-3.5 text-sm text-[#a9abaf] hover:text-[#f8f9fe] font-bold font-headline">
            Favorites
          </Link>
          <Link to="/history" className="flex items-center px-6 py-3.5 text-sm text-[#a9abaf] hover:text-[#f8f9fe] font-bold font-headline">
            History
          </Link>
          <Link to="/all-anime" className="flex items-center px-6 py-3.5 text-sm text-[#a9abaf] hover:text-[#f8f9fe] font-bold font-headline">
            All Anime
          </Link>
          <Link to="/batch" className="flex items-center px-6 py-3.5 text-sm text-[#a9abaf] hover:text-[#f8f9fe] font-bold font-headline">
            Batch Download
          </Link>
        </div>
      )}

      {/* Full-screen search overlay — mobile */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0b0e11]/95 backdrop-blur-md animate-fade-in">
          <div className="max-w-2xl mx-auto px-4 pt-20">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-3 bg-[#22262b] border border-[#ff8c94]/30 rounded-2xl px-4 py-3"
              style={{ boxShadow: "0 0 20px rgba(255,140,148,0.15)" }}
            >
              <Search size={20} className="text-[#ff8c94] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className="flex-1 bg-transparent text-[#f8f9fe] placeholder-[#737679] outline-none text-base"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[#a9abaf] hover:text-[#f8f9fe] transition-colors">
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
