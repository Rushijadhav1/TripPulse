"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertTriangle className="size-12 text-destructive" />

          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>

          <p className="max-w-md text-sm text-muted-foreground">
            A critical error occurred. Please try refreshing the page.
          </p>

          <button
            onClick={reset}
            className="mt-4 inline-flex items-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:opacity-90"
          >
            Refresh page
          </button>
        </main>
      </body>
    </html>
  );
}
