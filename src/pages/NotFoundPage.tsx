import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-display font-black text-gradient mb-4">404</div>
      <h1 className="text-2xl font-bold text-text-base mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-text-muted text-sm mb-8 max-w-sm">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="flex items-center gap-2 px-5 py-3 bg-brand hover:bg-brand-light rounded-xl font-semibold text-sm text-white transition-colors brand-glow">
          <Home size={15} /> Beranda
        </Link>
        <Link to="/search" className="flex items-center gap-2 px-5 py-3 bg-bg-elevated border border-subtle hover:border-brand/40 rounded-xl font-semibold text-sm text-text-muted hover:text-text-base transition-colors">
          <Search size={15} /> Cari Anime
        </Link>
      </div>
    </div>
  );
}
