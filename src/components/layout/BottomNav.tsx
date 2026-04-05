import { Link, useLocation } from "react-router-dom";
import { Home, Play, CheckCircle, List, Clock } from "lucide-react";

const LINKS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/ongoing", icon: Play, label: "Ongoing" },
  { to: "/completed", icon: CheckCircle, label: "Done" },
  { to: "/genre", icon: List, label: "Genre" },
  { to: "/history", icon: Clock, label: "History" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe border-t border-[#22262b]"
      style={{ background: "rgba(11,14,17,0.95)", backdropFilter: "blur(24px)" }}>
      <div className="flex items-center justify-around h-14">
        {LINKS.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${active ? "text-[#ff8c94]" : "text-[#737679]"}`}>
              <Icon size={18} fill={active ? "#ff8c94" : "none"} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
