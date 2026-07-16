/**
 * Loading fallback for the (dynamic) catalog routes. Mirrors the catalog
 * layout with shimmering placeholders (.img-skeleton) so a slow navigation
 * shows an instant, animated preview instead of a blank screen.
 */
export default function CatalogSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10" aria-hidden>
      {/* Back button + heading */}
      <div className="img-skeleton mb-6 h-9 w-24 rounded-full" />
      <div className="mb-8 space-y-3">
        <div className="img-skeleton h-9 w-64 max-w-full rounded-lg" />
        <div className="img-skeleton h-4 w-80 max-w-full rounded" />
      </div>

      {/* Search */}
      <div className="img-skeleton h-12 w-full rounded-full" />

      {/* Series chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="img-skeleton h-8 rounded-full"
            style={{ width: `${70 + (i % 4) * 24}px` }}
          />
        ))}
      </div>
      {/* Year chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="img-skeleton h-8 w-16 rounded-full" />
        ))}
      </div>

      {/* Card grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="glass overflow-hidden rounded-2xl">
            <div className="img-skeleton aspect-[4/5]" />
            <div className="space-y-2 p-4">
              <div className="img-skeleton h-3 w-20 rounded" />
              <div className="img-skeleton h-4 w-32 rounded" />
              <div className="img-skeleton h-3 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
