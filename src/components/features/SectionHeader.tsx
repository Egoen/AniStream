import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({ title, icon: Icon, viewAllHref, viewAllLabel = "Lihat Semua" }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-brand" />}
        <h2 className="text-base sm:text-lg font-bold text-text-base">{title}</h2>
        <div className="hidden sm:block h-px w-8 bg-brand/40 ml-1" />
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className="flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-light transition-colors">
          {viewAllLabel} <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
