"use client";

import Link from "next/link";
import { Loader2, MapPin } from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function SharedTrip({
  token,
}: {
  token: string;
}) {
  const trip = useQuery(api.trips.getSharedTrip, {
    shareToken: token,
  });

  if (trip === undefined) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (trip === null) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <MapPin className="size-10 text-muted-foreground" />

        <h1 className="text-2xl font-semibold">
          Trip not available
        </h1>

        <p className="text-sm text-muted-foreground">
          This trip isn&apos;t public or the sharing link is invalid.
        </p>

        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Go home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Shared TripPulse Trip
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            {trip.title}
          </h1>

          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            {trip.destination}
            {trip.country
              ? `, ${trip.country}`
              : ""}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Trip summary
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {trip.summary}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold sm:text-xl">
            Itinerary
          </h2>

          <div className="mt-6 space-y-8">
            {trip.itinerary.map((day) => (
              <div
                key={`${day.day}-${day.date}`}
                className="space-y-3"
              >
                <div>
                  <h3 className="font-semibold">
                    Day {day.day} · {day.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {day.date}
                  </p>
                </div>

                {day.activities.map(
                  (activity, index) => (
                    <div
                      key={`${activity.title}-${index}`}
                      className="rounded-lg border p-4"
                    >
                      <p className="font-medium">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {activity.time} ·{" "}
                        {activity.location}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}