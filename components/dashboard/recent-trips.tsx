"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import GlowingCard from "@/components/ui/glowing-card";

type Trip = {
  _id: string;
  title: string;
  destination: string;
  country?: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelStyle: string[];
  status: string;
};

type RecentTripsProps = {
  trips: Trip[];
  loading?: boolean;
};

export function RecentTrips({
  trips,
  loading = false,
}: RecentTripsProps) {
  return (
    <section className="pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Your trips
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest adventures
            </p>
          </div>

          {trips.length > 3 && (
            <Link
              href="/trips"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              See all
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <GlowingCard key={item} variant="subtle" className="min-w-[280px] flex-1 animate-pulse">
                <div className="p-5">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="mt-4 h-3 w-40 rounded bg-muted" />
                  <div className="mt-6 h-3 w-32 rounded bg-muted" />
                  <div className="mt-4 h-3 w-24 rounded bg-muted" />
                </div>
              </GlowingCard>
            ))}
          </div>
        ) : trips.length === 0 ? (
          /* Empty state */
          <GlowingCard variant="subtle" className="border-dashed">
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                <Plane className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No trips yet
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Create your first trip and let TripPulse build
                a personalized itinerary for you.
              </p>

              <Link
                href="/planner"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
              >
                Plan my first trip
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </GlowingCard>
        ) : (
          /* Trips */
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {trips.slice(0, 6).map((trip) => (
              <Link
                key={trip._id}
                href={`/trips/${trip._id}`}
                className="group min-w-[calc(100%-1rem)] snap-start sm:min-w-[320px] md:min-w-0"
              >
                <GlowingCard variant="subtle" className="h-full">
                  {/* Visual header */}
                  <div className="relative h-24 overflow-hidden bg-muted/30 sm:h-28">
                    {/* Plane icon */}
                    <div className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-background/60 text-foreground backdrop-blur-md">
                      <Plane className="size-4" />
                    </div>

                    {/* Status */}
                    <Badge
                      variant="secondary"
                      className="absolute right-4 top-4 max-w-[120px] truncate rounded-full px-2.5 py-1 text-[10px] font-medium capitalize"
                    >
                      {trip.status}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="line-clamp-1 text-base font-semibold tracking-tight sm:text-lg">
                      {trip.title}
                    </h3>

                    {/* Location */}
                    <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />

                      <span className="truncate">
                        {trip.destination}
                        {trip.country
                          ? `, ${trip.country}`
                          : ""}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="mt-3 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />

                      <span className="truncate">
                        {trip.startDate} → {trip.endDate}
                      </span>
                    </div>

                    {/* Travel styles */}
                    {trip.travelStyle.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {trip.travelStyle
                          .slice(0, 3)
                          .map((style) => (
                            <Badge
                              key={style}
                              variant="outline"
                              className="rounded-full px-2.5 py-1 text-[10px]"
                            >
                              {style}
                            </Badge>
                          ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t pt-4">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Budget
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold">
                          {trip.currency}{" "}
                          {trip.budget.toLocaleString()}
                        </p>
                      </div>

                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </GlowingCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}