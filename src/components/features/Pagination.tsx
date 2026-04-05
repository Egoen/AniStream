import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages?: number;
  hasNext?: boolean;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, hasNext, onPageChange }: Props) {
  const hasPrev = page > 1;
  const canGoNext = hasNext !== undefined ? hasNext : (totalPages ? page < totalPages : false);

  const getPages = () => {
    if (!totalPages) return [];
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-bg-elevated border border-subtle text-sm font-medium text-text-muted hover:text-text-base hover:border-brand/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-text-subtle text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
              p === page
                ? "bg-brand text-white brand-glow"
                : "bg-bg-elevated border border-subtle text-text-muted hover:text-text-base hover:border-brand/40"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-bg-elevated border border-subtle text-sm font-medium text-text-muted hover:text-text-base hover:border-brand/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
