"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle className="size-12 text-destructive" />

      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>

      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:opacity-90"
        >
          Try again
        </button>

        <Link
          href="/"
          className="inline-flex items-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
