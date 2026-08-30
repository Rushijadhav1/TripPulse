export default function DashboardLoading() {
  return (
    <main className="min-h-dvh overflow-x-hidden px-4 pb-28 pt-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-2">
        {/* Hero skeleton */}
        <div className="rounded-3xl border border-border/60 bg-background/90 p-6 backdrop-blur-xl sm:p-8">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-7 w-64 animate-pulse rounded bg-muted sm:h-8" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>

        {/* CTA skeleton */}
        <div className="rounded-3xl border border-border/60 bg-background/90 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex items-center gap-4">
            <div className="size-10 animate-pulse rounded-xl bg-muted" />
            <div className="flex-1">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-3 pt-8 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-background/90 p-4 backdrop-blur-xl sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div className="size-9 animate-pulse rounded-xl bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-4 h-7 w-16 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Recent trips skeleton */}
        <div className="pt-8">
          <div className="mb-4">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[280px] flex-1 animate-pulse rounded-3xl border border-border/60 bg-background/90"
              >
                <div className="h-24 bg-muted sm:h-28" />
                <div className="p-5">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="mt-4 h-3 w-40 rounded bg-muted" />
                  <div className="mt-6 h-3 w-32 rounded bg-muted" />
                  <div className="mt-4 h-3 w-24 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
