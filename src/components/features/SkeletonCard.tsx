export function SkeletonCard() {
  return (
    <div className="w-36 sm:w-44 shrink-0">
      <div className="h-52 sm:h-60 rounded-xl shimmer-bg" />
      <div className="mt-2 h-3 rounded shimmer-bg" />
      <div className="mt-1 h-2 rounded shimmer-bg w-2/3" />
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="block">
          <div className="aspect-[2/3] rounded-xl shimmer-bg" />
          <div className="mt-1.5 h-3 rounded shimmer-bg" />
          <div className="mt-1 h-2 rounded shimmer-bg w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRow({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-56 h-80 rounded-2xl shimmer-bg shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-7 rounded shimmer-bg w-3/4" />
          <div className="h-4 rounded shimmer-bg w-1/2" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="h-6 w-16 rounded-full shimmer-bg" />)}
          </div>
          <div className="space-y-2 mt-4">
            {[1,2,3,4].map(i => <div key={i} className="h-3 rounded shimmer-bg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
