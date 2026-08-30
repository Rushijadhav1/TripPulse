import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import GlowingCard from "@/components/ui/glowing-card";

export function DashboardTripCta() {
  return (
    <section className="pt-8">
      <div className="mx-auto max-w-7xl">
        <GlowingCard>
          <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="absolute -right-20 -top-20 size-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <Sparkles className="size-5" />
              </div>

              <div>
                <div className="mb-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  AI Planner
                </div>

                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Create a new trip
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Tell us where you want to go and we&apos;ll
                  help build a personalized itinerary for you.
                </p>
              </div>
            </div>

            <Link
              href="/planner"
              className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            >
              Start planning
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </GlowingCard>
      </div>
    </section>
  );
}