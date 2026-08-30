export default function ProfileLoading() {
  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back link skeleton */}
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />

        {/* Page heading skeleton */}
        <div>
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>

        {/* Profile card skeleton */}
        <div className="rounded-3xl border border-border/60 bg-background/90 backdrop-blur-xl">
          {/* Card header */}
          <div className="border-b bg-muted/20 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="size-20 animate-pulse rounded-full bg-muted" />
              <div>
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          {/* Card content */}
          <div className="space-y-7 p-5 sm:p-7">
            {/* Name section */}
            <section>
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
              </div>
              <div className="mt-4 h-16 w-full animate-pulse rounded-2xl bg-muted" />
            </section>

            {/* Email section */}
            <section>
              <div>
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-3 w-56 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-muted/20 p-4">
                <div className="size-10 animate-pulse rounded-xl bg-muted" />
                <div>
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-4 w-40 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </section>

            {/* Sign out section */}
            <section className="flex items-center justify-between">
              <div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
