"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  Plane,
  Plus,
} from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function TripsPage() {
  const trips = useQuery(api.trips.getMyTrips);

  const loading = trips === undefined;

  return (
    <main className="min-h-dvh px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Your journeys
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              My Trips
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Keep all your travel plans, itineraries,
              budgets, and packing lists in one place.
            </p>
          </div>

          <Link
            href="/planner"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
          >
            <Plus className="size-4" />
            Plan a new trip
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading your trips...
            </div>
          </div>
        ) : trips.length === 0 ? (
          /* Empty state */
          <Card className="rounded-3xl border-dashed border-border/70 bg-muted/20">
            <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                <Plane className="size-6 text-muted-foreground" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No trips yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Your next adventure is waiting. Create your
                first trip and let TripPulse build the plan.
              </p>

              <Link
                href="/planner"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
              >
                Start planning
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Trips */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip._id}
                href={`/trips/${trip._id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  {/* Visual header */}
                  <div className="relative h-32 overflow-hidden bg-muted/30">
                    <div className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-2xl border border-border/40 bg-background/60 backdrop-blur-md">
                      <Plane className="size-5" />
                    </div>

                    <Badge
                      variant="secondary"
                      className="absolute right-5 top-5 capitalize"
                    >
                      {trip.status}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h2 className="line-clamp-1 text-lg font-semibold tracking-tight">
                      {trip.title}
                    </h2>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />

                      <span className="line-clamp-1">
                        {trip.destination}
                        {trip.country
                          ? `, ${trip.country}`
                          : ""}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />

                      <span>
                        {trip.startDate} → {trip.endDate}
                      </span>
                    </div>

                    {trip.travelStyle.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {trip.travelStyle
                          .slice(0, 3)
                          .map((style) => (
                            <Badge
                              key={style}
                              variant="outline"
                              className="rounded-full text-[10px]"
                            >
                              {style}
                            </Badge>
                          ))}
                      </div>
                    )}

                    <div className="mt-5 flex items-end justify-between border-t pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Budget
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {trip.currency}{" "}
                          {trip.budget.toLocaleString()}
                        </p>
                      </div>

                      <span className="flex size-9 items-center justify-center rounded-full border bg-background transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}