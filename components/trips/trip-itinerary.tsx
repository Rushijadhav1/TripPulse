"use client";

import {
  Clock3,
  MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Activity = {
  time: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost: number;
  category: string;
};

type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
};

type TripItineraryProps = {
  itinerary: ItineraryDay[];
  currency: string;
};

export function TripItinerary({
  itinerary,
  currency,
}: TripItineraryProps) {
  if (itinerary.length === 0) {
    return (
      <Card className="rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your itinerary hasn&apos;t been generated yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Your journey
        </p>

        <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Itinerary
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your day-by-day travel plan.
        </p>
      </div>

      <div className="space-y-5">
        {itinerary.map((day) => (
          <Card
            key={`${day.day}-${day.date}`}
            className="overflow-hidden rounded-3xl border-border/60 bg-background/90 shadow-sm backdrop-blur-xl"
          >
            {/* Day header */}
            <CardHeader className="border-b bg-muted/20 p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-xs font-semibold text-background">
                      {day.day}
                    </span>

                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        {day.title}
                      </CardTitle>

                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {formatDayDate(day.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {day.activities.length}{" "}
                  {day.activities.length === 1
                    ? "activity"
                    : "activities"}
                </span>
              </div>
            </CardHeader>

            {/* Timeline */}
            <CardContent className="p-5 sm:p-6">
              <div className="relative space-y-6">
                {/* Vertical line */}
                <div className="absolute bottom-3 left-[17px] top-3 w-px bg-border" />

                {day.activities.map((activity, index) => (
                  <div
                    key={`${activity.title}-${index}`}
                    className="relative flex gap-4"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-1 flex size-[10px] shrink-0 rounded-full border-2 border-background bg-foreground ring-1 ring-border" />

                    {/* Activity */}
                    <div className="min-w-0 flex-1">
                      <div className="rounded-2xl border bg-background p-4 transition-colors hover:bg-muted/30 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">
                                <Clock3 className="size-3" />
                                {activity.time}
                              </span>

                              {activity.category && (
                                <span className="rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground">
                                  {activity.category}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 text-base font-semibold">
                              {activity.title}
                            </h3>

                            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>

                          <div className="shrink-0 rounded-xl bg-muted/60 px-3 py-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Cost
                            </p>

                            <p className="mt-0.5 text-sm font-semibold">
                              {currency}{" "}
                              {activity.estimatedCost.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {activity.location && (
                          <>
                            <Separator className="my-4" />

                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <MapPin className="mt-0.5 size-3.5 shrink-0" />

                              <span>
                                {activity.location}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function formatDayDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}