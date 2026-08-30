"use client";

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Luggage,
  Sparkles,
} from "lucide-react";

import GlowingCard from "@/components/ui/glowing-card";

export function QuickActions() {
  return (
    <section className="pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Get where you need to go faster.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* My Trips */}
          <GlowingCard variant="subtle">
            <Link
              href="/trips"
              className="group flex min-h-16 w-full items-center justify-between p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted transition-transform duration-300 group-hover:scale-105">
                  <Luggage className="size-5 text-muted-foreground" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    My Trips
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    View your adventures
                  </p>
                </div>
              </div>

              <span className="flex size-8 items-center justify-center rounded-full border bg-background transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </GlowingCard>

          {/* Explore */}
          <GlowingCard variant="subtle">
            <Link
              href="/explore"
              className="group flex min-h-16 w-full items-center justify-between p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted transition-transform duration-300 group-hover:scale-105">
                  <Compass className="size-5 text-muted-foreground" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Explore
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Discover destinations
                  </p>
                </div>
              </div>

              <span className="flex size-8 items-center justify-center rounded-full border bg-background transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </GlowingCard>

          {/* Ask TripPulse */}
          <GlowingCard variant="strong">
            <Link
              href="/planner"
              className="group flex min-h-16 w-full items-center gap-4 p-4 sm:p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="size-5 text-primary" />
              </span>

              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Ask TripPulse
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Get instant travel help
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </GlowingCard>
        </div>
      </div>
    </section>
  );
}
