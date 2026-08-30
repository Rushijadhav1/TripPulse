export default function ExploreLoading() {
  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
        </div>

        {/* Search skeleton */}
        <div className="flex gap-3">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 w-24 animate-pulse rounded-xl bg-muted" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-24 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        {/* Results skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border/60 bg-background/90 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
