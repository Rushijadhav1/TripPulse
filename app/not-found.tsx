import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <MapPin className="size-12 text-muted-foreground" />

      <h1 className="text-3xl font-semibold tracking-tight">
        Page not found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:opacity-90"
      >
        Go home
      </Link>
    </main>
  );
}
