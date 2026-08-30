export default function TripsLoading() {
  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-32 animate-pulse rounded bg-muted" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        {/* Trip cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-border/60 bg-background/90"
            >
              <div className="flex items-center gap-4 p-5">
                <div className="size-12 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
