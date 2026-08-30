export default function PlannerLoading() {
  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        {/* Form skeleton */}
        <div className="rounded-3xl border border-border/60 bg-background/90 p-6 backdrop-blur-xl sm:p-8">
          <div className="space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>

            {/* Dates row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>

            {/* Travelers + Budget row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>

            {/* Travel style */}
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 animate-pulse rounded-full bg-muted"
                  />
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
