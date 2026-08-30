"use client";

import { useEffect } from "react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";

import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
);

function useSuppressConvexStreamErrors() {
  useEffect(() => {
    const isStreamError = (msg: string) =>
      msg.includes("Cannot write to a CLOSED writable stream") ||
      msg.includes("Cannot close a CLOSED writable stream");

    const origError = console.error;
    console.error = (...args: unknown[]) => {
      const msg = args
        .map((a) => (a instanceof Error ? a.message : String(a)))
        .join(" ");
      if (!isStreamError(msg)) origError.apply(console, args);
    };

    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const msg = args
        .map((a) => (a instanceof Error ? a.message : String(a)))
        .join(" ");
      if (!isStreamError(msg)) origWarn.apply(console, args);
    };

    const handler = (event: Event) => {
      const msg =
        event instanceof ErrorEvent ? event.message : "";
      if (isStreamError(msg)) event.preventDefault();
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const msg =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason);
      if (isStreamError(msg)) event.preventDefault();
    };

    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", rejectionHandler);
    return () => {
      console.error = origError;
      console.warn = origWarn;
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);
}

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: React.ReactNode;
  initialToken?: string | null;
}) {
  useSuppressConvexStreamErrors();

  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}